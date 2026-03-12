<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Payment;
use App\Services\FeatureGateService;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        private PaymentService     $paymentService,
        private FeatureGateService $featureGate,
    ) {}

    // ─── Shared plan data ─────────────────────────────────────────────────────

    public function plansForModal(): array
    {
        return Plan::active()->get()->map(fn (Plan $plan) => [
            'id'          => $plan->id,
            'name'        => $plan->name,
            'slug'        => $plan->slug,
            'price'       => (float) $plan->price,
            'description' => $this->planDescription($plan->slug),
            'features'    => $this->buildFeaturesList($plan),
            'is_free'     => $plan->isFree(),
            'is_popular'  => $plan->slug === 'pro',
            'cta_text'    => 'Choose ' . $plan->name,
        ])->values()->toArray();
    }

    // ─── Checkout page ────────────────────────────────────────────────────────

    public function show(string $plan): Response
    {
        $planModel = is_numeric($plan)
            ? Plan::where('id', $plan)->where('is_active', true)->firstOrFail()
            : Plan::where('is_active', true)
                  ->where(function ($q) use ($plan) {
                      $q->where('slug', strtolower($plan))
                        ->orWhere('name', ucfirst(strtolower($plan)));
                  })
                  ->firstOrFail();

        if ($planModel->isFree()) {
            $this->activateAndUpdatePackage(auth()->user(), $planModel);
            $this->markUserVerified(auth()->user());
            return redirect()->route('agent.dashboard')->with('success', 'Free plan activated!');
        }

        return Inertia::render('CheckoutPage', [
            'plan' => [
                'id'                    => $planModel->id,
                'name'                  => $planModel->name,
                'slug'                  => $planModel->slug,
                'price'                 => (float) $planModel->price,
                'listing_limit'         => $planModel->listing_limit,
                'listing_limit_display' => $planModel->listing_limit_display,
                'boost_limit'           => $planModel->boost_limit,
                'lead_limit'            => $planModel->lead_limit,
                'verified_badge'        => (bool) $planModel->verified_badge,
                'priority_ranking'      => (bool) $planModel->priority_ranking,
                'analytics_access'      => (bool) $planModel->analytics_access,
                'features'              => $this->buildFeaturesList($planModel),
                'description'           => $this->planDescription($planModel->slug),
            ],
        ]);
    }

    // ─── Payment actions ──────────────────────────────────────────────────────

    public function start(Request $request)
    {
        $request->validate([
            'plan_id'  => 'required|exists:plans,id',
            'provider' => 'required|in:paystack,flutterwave',
        ]);

        $plan = Plan::findOrFail($request->plan_id);
        $user = auth()->user();

        if ($user->subscription?->plan_id === $plan->id && $user->subscription?->isActive()) {
            return back()->with('error', 'You are already on this plan.');
        }

        try {
            $result = $this->paymentService->initiate($user, $plan, $request->provider);

            if ($result['free'] ?? false) {
                // Free path from initiate() — update package too
                $this->updateUserPackage($user, $plan);
                $this->markUserVerified($user);
                return redirect()->route('agent.dashboard')->with('success', 'Free plan activated!');
            }

            return Inertia::location($result['authorization_url']);

        } catch (\Throwable $e) {
            return back()->with('error', 'Payment initialization failed. Please try again.');
        }
    }

    public function callback(Request $request)
    {
        $provider  = $request->query('provider', 'paystack');
        $reference = $request->query('reference') ?? $request->query('tx_ref');

        if (! $reference) {
            return redirect()->to('/pricing')->with('error', 'Payment reference missing.');
        }

        $payment = Payment::where('reference', $reference)->first();

        if ($payment?->status === 'success') {
            // Webhook already confirmed — sync package from subscription
            if ($payment->user) {
                $this->syncPackageFromSubscription($payment->user);
                $this->markUserVerified($payment->user);
            }
            return redirect()->route('agent.dashboard')
                ->with('success', 'Subscription activated! Welcome aboard.');
        }

        $confirmed = $this->paymentService->verifyAndConfirm($reference, $provider);

        if ($confirmed) {
            // Manual verify confirmed — sync package
            $payment->refresh();
            if ($payment->user) {
                $this->syncPackageFromSubscription($payment->user);
                $this->markUserVerified($payment->user);
            }
            return redirect()->route('agent.dashboard')
                ->with('success', 'Subscription activated! Welcome aboard.');
        }

        return redirect()->to('/pricing')
            ->with('error', 'Payment could not be verified. Contact support if you were charged.');
    }

    public function cancel(Request $request)
    {
        $user = auth()->user();
        $cancelled = $this->paymentService->cancel($user);

        if ($cancelled) {
            // Downgrade package back to free on cancellation
            $this->updateUserPackage($user, Plan::where('slug', 'free')->first());
            return back()->with('success', 'Subscription cancelled. Your plan stays active until the billing period ends.');
        }

        return back()->with('error', 'No active subscription to cancel.');
    }

    // ─── Package sync helpers ─────────────────────────────────────────────────

    /**
     * Public entry point for activating free plan from AgentController.
     * PaymentService::activateFree() handles both subscription + package sync.
     */
    public function activateFreeForAgent($user, Plan $plan): void
    {
        $this->paymentService->activateFree($user, $plan);
    }

    /**
     * Activate free plan via PaymentService AND update user->package.
     */
    private function activateAndUpdatePackage($user, Plan $plan): void
    {
        $this->paymentService->activateFree($user, $plan);
        $this->updateUserPackage($user, $plan);
    }

    /**
     * Update user->package to the plan slug.
     * Keeps the users table in sync with the subscriptions table.
     */
    private function updateUserPackage($user, ?Plan $plan): void
    {
        if (! $user || ! $plan) return;

        $user->package = $plan->slug;
        $user->save();
    }

    /**
     * Sync user->package from their active subscription.
     * Used after webhook confirmation where we only have the payment record.
     */
    private function syncPackageFromSubscription($user): void
    {
        $sub = $user->subscription()->with('plan')->first();

        if ($sub?->plan) {
            $this->updateUserPackage($user, $sub->plan);
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private function buildFeaturesList(Plan $plan): array
    {
        // use explicit rental and sale limits when available to make offerings crystal clear
        $rentalDesc = $plan->rental_limit === null ? 'Unlimited rental listings' : "{$plan->rental_limit} rental listings";
        $saleDesc   = $plan->sale_limit   === null ? 'Unlimited sale listings'   : "{$plan->sale_limit} sale listings";

        return match ($plan->slug) {
            'free' => [
                // 'Submit listings to the platform',
                // 'Limited visibility in search results',
                'Basic listing management',
                // 'Access to tenant inquiries',
                'Standard support',
                $rentalDesc,
                $saleDesc,
            ],
            'pro' => [
                'Everything in Free, plus:',
                $rentalDesc,
                $saleDesc,
                // 'Verified landlord badge',
                'Higher ranking in search results',
                'Respond to reviews',
            ],
            'elite' => [
                'Everything in Pro, plus:',
                // 'Unlimited property listings',
                // "Lead unlock credits ({$plan->lead_limit}/month)",
                'Featured listing placement',
                'Dedicated account manager',
            ],
            default => array_values(array_filter([
                $plan->listing_limit_display . ' property listings',
                $plan->boost_limit > 0  ? "{$plan->boost_limit} listing boosts/month" : null,
                $plan->lead_limit > 0   ? "{$plan->lead_limit} lead contacts/month"   : null,
                $plan->verified_badge   ? 'Verified landlord badge'                    : null,
                $plan->priority_ranking ? 'Priority search ranking'                    : null,
                $plan->analytics_access ? 'Analytics dashboard access'                 : null,
            ])),
        };
    }

    private function planDescription(string $slug): string
    {
        return match ($slug) {
            'free'  => 'Perfect for getting started',
            'pro'   => 'Build trust and stand out',
            'elite' => 'Advanced tools for professionals',
            default => 'RentTrust subscription plan',
        };
    }

    /**
     * Mark a user record as verified.
     */
    private function markUserVerified($user): void
    {
        if (! $user) {
            return;
        }

        $user->status = 'verified';
        $user->save();
    }
}