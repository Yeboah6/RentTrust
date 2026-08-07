<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Payment;
// use App\Services\FeatureGateService;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        private PaymentService     $paymentService,
        // private FeatureGateService $featureGate,
    ) {}

    // ─── Shared plan data ─────────────────────────────────────────────────────
    public function plansForModal(): array
    {
        return Plan::active()
            ->orderBy('sort_order')
            ->orderBy('price')
            ->get()
            ->map(fn (Plan $plan) => $this->formatPlan($plan))
            ->values()
            ->toArray();
    }

    // ─── Checkout page ────────────────────────────────────────────────────────

    public function show(string $plan): Response
    {
        $planModel = is_numeric($plan)
            ? Plan::where('id', $plan)->where('is_active', true)->firstOrFail()
            : Plan::where('is_active', true)
                  ->where(fn ($q) => $q->where('slug', strtolower($plan))
                                       ->orWhere('name', ucfirst(strtolower($plan))))
                  ->firstOrFail();

        if ($planModel->isFree()) {
            $this->activateAndUpdatePackage(auth()->user(), $planModel);
            // $this->markUserVerified(auth()->user());
            return redirect()->route('agent.dashboard')->with('success', 'Free plan activated!');
        }

        $popularPlanId = $this->resolvePopularPlanId();

        return Inertia::render('CheckoutPage', [
            'plan'     => $this->formatPlan($planModel, $popularPlanId),
            'allPlans' => $this->plansForModal(),
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
                $this->updateUserPackage($user, $plan);
                // $this->markUserVerified($user);
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

        $payment     = Payment::where('reference', $reference)->first();
        $currentUser = Auth::user();

        if ($payment?->status === 'success') {
            return $this->handleConfirmedPayment($payment, $currentUser, $request);
        }

        $confirmed = $this->paymentService->verifyAndConfirm($reference, $provider);

        if ($confirmed) {
            $payment->refresh();
            return $this->handleConfirmedPayment($payment, $currentUser, $request);
        }

        return redirect()->to('/pricing')
            ->with('error', 'Payment could not be verified. Contact support if you were charged.');
    }

    public function cancel(Request $request)
    {
        $user      = auth()->user();
        $cancelled = $this->paymentService->cancel($user);

        if ($cancelled) {
            $freePlan = Plan::free()->first(); // uses a local scope — see note below
            $this->updateUserPackage($user, $freePlan);
            return back()->with('success', 'Subscription cancelled. Your plan stays active until the billing period ends.');
        }

        return back()->with('error', 'No active subscription to cancel.');
    }

    // ─── Package sync helpers ─────────────────────────────────────────────────

    public function activateFreeForAgent($user, Plan $plan): void
    {
        $this->paymentService->activateFree($user, $plan);
    }

    private function activateAndUpdatePackage($user, Plan $plan): void
    {
        $this->paymentService->activateFree($user, $plan);
        $this->updateUserPackage($user, $plan);
    }

    private function updateUserPackage($user, ?Plan $plan): void
    {
        if (! $user || ! $plan) return;

        $user->package = $plan->slug;
        $user->save();
    }

    private function syncPackageFromSubscription($user): void
    {
        $sub = $user->subscription()->with('plan')->first();

        if ($sub?->plan) {
            $this->updateUserPackage($user, $sub->plan);
        }
    }

    private function markUserVerified($user): void
    {
        if (! $user) return;

        $user->status = 'verified';
        $user->save();
    }

    // ─── Plan formatting ──────────────────────────────────────────────────────

    /**
     * Single source of truth for plan data sent to the frontend.
     * All values come from DB columns — nothing is slug-matched or hardcoded.
     */
    private function formatPlan(Plan $plan, ?int $popularPlanId = null): array
    {
        return [
            'id'                    => $plan->id,
            'name'                  => $plan->name,
            'slug'                  => $plan->slug,
            'price'                 => (float) $plan->price,
            'description'           => $plan->description ?? $plan->tagline ?? '',
            'listing_limit'         => $plan->listing_limit,
            'listing_limit_display' => $plan->listing_limit_display,
            'boost_limit'           => $plan->boost_limit   ?? 0,
            'lead_limit'            => $plan->lead_limit    ?? 0,
            'verified_badge'        => (bool) ($plan->verified_badge    ?? false),
            'priority_ranking'      => (bool) ($plan->priority_ranking  ?? false),
            'analytics_access'      => (bool) ($plan->analytics_access  ?? false),
            'features'              => $this->buildFeaturesList($plan),
            'is_free'               => $plan->isFree(),
            'is_popular'            => $popularPlanId !== null && $plan->id === $popularPlanId,
            'cta_text'              => 'Choose ' . $plan->name,
            'color'                 => $plan->color ?? null, // optional UI hint column
        ];
    }

    private function buildFeaturesList(Plan $plan): array
    {
        if (! empty($plan->features) && is_array($plan->features)) {
            return array_values(array_filter($plan->features));
        }

        $features = [];

        if ($plan->listing_limit_display) {
            $features[] = $plan->listing_limit_display . ' property listings';
        } elseif ($plan->listing_limit === null) {
            $features[] = 'Unlimited property listings';
        } else {
            $features[] = "{$plan->listing_limit} property listings";
        }

        if (isset($plan->rental_limit)) {
            $features[] = $plan->rental_limit === null
                ? 'Unlimited rental listings'
                : "{$plan->rental_limit} rental listings";
        }

        if (isset($plan->sale_limit)) {
            $features[] = $plan->sale_limit === null
                ? 'Unlimited sale listings'
                : "{$plan->sale_limit} sale listings";
        }

        // Boolean capabilities
        if ($plan->verified_badge) {
            $features[] = 'Verified badge on profile & listings';
        }

        if ($plan->priority_ranking) {
            $features[] = 'Priority placement in search results';
        }

        if ($plan->analytics_access) {
            $features[] = 'Analytics dashboard access';
        }

        // Support tier — add a `support_tier` column (e.g. 'basic', 'priority', 'dedicated')
        if (! empty($plan->support_tier)) {
            $features[] = match ($plan->support_tier) {
                'dedicated' => 'Dedicated account manager',
                'priority'  => 'Priority support',
                default     => 'Standard support',
            };
        }

        return array_values(array_filter($features));
    }

    // ─── Popular plan resolution ──────────────────────────────────────────────
    private function resolvePopularPlanId(): ?int
    {
        $paidPlans = Plan::active()
            ->where('price', '>', 0)
            ->orderBy('price')
            ->get(['id', 'price']);

        if ($paidPlans->isEmpty()) return null;

        $hasPopularColumn = Schema::hasColumn('plans', 'is_popular');
        if ($hasPopularColumn) {
            $paidPlansWithFlags = Plan::active()
                ->where('price', '>', 0)
                ->orderBy('price')
                ->get(['id', 'price', 'is_popular']);

            $explicit = $paidPlansWithFlags->firstWhere('is_popular', true);
            if ($explicit) return $explicit->id;
        }

        // Fall back to the middle-priced plan.
        $index = (int) floor(($paidPlans->count() - 1) / 2);
        return $paidPlans->values()[$index]?->id;
    }

    // ─── Confirmed payment handler ────────────────────────────────────────────

    /**
     * Shared post-confirmation logic used by both the webhook-confirmed
     * and manual-verify paths in callback().
     */
    private function handleConfirmedPayment(Payment $payment, $currentUser, Request $request)
    {
        $wasFree = $currentUser?->package === 'free'
                   || ($currentUser?->subscription?->plan?->isFree() ?? true);

        if ($payment->user) {
            $this->syncPackageFromSubscription($payment->user);
            // $this->markUserVerified($payment->user);
        }

        $newPlan = $payment->subscription?->plan;

        // If the user was on a free plan and has now upgraded to any paid plan,
        // force a re-login so middleware picks up the new role/package cleanly.
        if ($wasFree && $newPlan && ! $newPlan->isFree()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')
                ->with('success', 'Your account was upgraded to ' . $newPlan->name . '. Please log in again to access your new plan.');
        }

        return redirect()->route('agent.dashboard')
            ->with('success', 'Subscription activated! Welcome aboard.');
    }
}