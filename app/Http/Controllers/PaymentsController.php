<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentsController extends Controller
{
    // ─── Main Dashboard ───────────────────────────────────────────────────────

    public function paymentDashboard()
    {
        return inertia('Payments/PaymentsDashboard', [
            'kpis'          => $this->buildKpis(),
            'payments'      => $this->recentPayments(),
            'subscriptions' => $this->subscriptionList(),
            'analytics'     => $this->analyticsData(),
            'activity'      => $this->recentActivity(),
        ]);
    }

    // ─── KPIs ─────────────────────────────────────────────────────────────────

    private function buildKpis(): array
    {
        $now          = now();
        $thisMonth    = $now->copy()->startOfMonth();
        $lastMonth    = $now->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = $now->copy()->subMonth()->endOfMonth();

        // Revenue
        $totalRevenue  = (float) Payment::where('status', 'success')->sum('amount');
        $monthRevenue  = (float) Payment::where('status', 'success')
                                        ->where('created_at', '>=', $thisMonth)->sum('amount');
        $lastMonthRev  = (float) Payment::where('status', 'success')
                                        ->whereBetween('created_at', [$lastMonth, $lastMonthEnd])->sum('amount');
        $revChange     = $lastMonthRev > 0
                            ? round((($monthRevenue - $lastMonthRev) / $lastMonthRev) * 100, 1)
                            : null;

        // Active subscriptions
        $activeSubs    = Subscription::where('status', 'active')->count();
        $lastMonthSubs = Subscription::where('status', 'active')
                                     ->where('created_at', '<', $thisMonth)->count();
        $subsChange    = $lastMonthSubs > 0
                            ? round((($activeSubs - $lastMonthSubs) / $lastMonthSubs) * 100, 1)
                            : null;

        // Failed this month
        $failedCount     = Payment::where('status', 'failed')
                                  ->where('created_at', '>=', $thisMonth)->count();
        $lastFailedCount = Payment::where('status', 'failed')
                                  ->whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count();
        $failedChange    = $lastFailedCount > 0
                            ? round((($failedCount - $lastFailedCount) / $lastFailedCount) * 100, 1)
                            : null;

        // Pending refunds (payments marked refunded)
        $pendingRefunds = Payment::where('status', 'refunded')->count();
        $refundAmount   = (float) Payment::where('status', 'refunded')->sum('amount');

        // MRR = sum of plan prices for all active non-free subscriptions
        $mrr = (float) Subscription::where('status', 'active')
            ->join('plans', 'subscriptions.plan_id', '=', 'plans.id')
            ->where('plans.price', '>', 0)
            ->sum('plans.price');

        // Last month MRR approximation
        $lastMrr = (float) Subscription::where('status', 'active')
            ->where('subscriptions.created_at', '<', $thisMonth)
            ->join('plans', 'subscriptions.plan_id', '=', 'plans.id')
            ->where('plans.price', '>', 0)
            ->sum('plans.price');
        $mrrChange = $lastMrr > 0 ? round((($mrr - $lastMrr) / $lastMrr) * 100, 1) : null;

        // Plan breakdown
        $planBreakdown = Subscription::where('subscriptions.status', 'active')
            ->join('plans', 'subscriptions.plan_id', '=', 'plans.id')
            ->select('plans.name', 'plans.slug', DB::raw('count(*) as count'))
            ->groupBy('plans.id', 'plans.name', 'plans.slug')
            ->get()
            ->mapWithKeys(fn ($row) => [$row->slug => ['name' => $row->name, 'count' => $row->count]])
            ->toArray();

        return [
            'total_revenue'   => $totalRevenue,
            'month_revenue'   => $monthRevenue,
            'rev_change'      => $revChange,
            'active_subs'     => $activeSubs,
            'subs_change'     => $subsChange,
            'failed_payments' => $failedCount,
            'failed_change'   => $failedChange,
            'pending_refunds' => $pendingRefunds,
            'refund_amount'   => $refundAmount,
            'mrr'             => $mrr,
            'mrr_change'      => $mrrChange,
            'plan_breakdown'  => $planBreakdown,
        ];
    }

    // ─── Payments list ────────────────────────────────────────────────────────

    private function recentPayments(int $limit = 100): array
    {
        return Payment::with(['user:id,name,email'])
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(fn ($p) => [
                'id'             => $p->id,
                'reference'      => $p->reference,
                'user'           => $p->user
                                        ? ['name' => $p->user->name, 'email' => $p->user->email]
                                        : null,
                'amount'         => (float) $p->amount,
                'currency'       => $p->currency,
                'provider'       => $p->provider,
                'status'         => $p->status,
                'failure_reason' => $p->failure_reason,
                'created_at'     => $p->created_at->format('M d, Y H:i'),
            ])
            ->toArray();
    }

    // ─── Subscriptions list ───────────────────────────────────────────────────

    private function subscriptionList(int $limit = 100): array
    {
        return Subscription::with(['user:id,name,email', 'plan:id,name,slug,price'])
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(fn ($s) => [
                'id'        => $s->id,
                'user'      => $s->user
                                  ? ['name' => $s->user->name, 'email' => $s->user->email]
                                  : null,
                'plan'      => $s->plan
                                  ? ['name' => $s->plan->name, 'slug' => $s->plan->slug, 'price' => (float) $s->plan->price]
                                  : null,
                'provider'  => $s->provider,
                'status'    => $s->status,
                'starts_at' => $s->starts_at?->format('M d, Y'),
                'ends_at'   => $s->ends_at?->format('M d, Y'),
                'days_left' => $s->ends_at
                                  ? max(0, (int) now()->diffInDays($s->ends_at, false))
                                  : null,
                'grace'     => $s->inGracePeriod(),
            ])
            ->toArray();
    }

    // ─── Analytics data ───────────────────────────────────────────────────────

    private function analyticsData(): array
    {
        // Detect the database driver so we use the correct date-formatting function.
        // SQLite uses strftime(); MySQL/MariaDB uses DATE_FORMAT().
        $driver    = DB::getDriverName();
        $monthExpr = $driver === 'sqlite'
            ? DB::raw("strftime('%Y-%m', created_at) as month")
            : DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month");

        $monthExprSubs = $driver === 'sqlite'
            ? DB::raw("strftime('%Y-%m', created_at) as month")
            : DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month");

        // Monthly revenue — last 12 months
        $monthly = Payment::where('status', 'success')
            ->where('created_at', '>=', now()->subMonths(12)->startOfMonth())
            ->select(
                $monthExpr,
                DB::raw('SUM(amount) as revenue'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($r) => [
                'month'   => $r->month,
                'revenue' => (float) $r->revenue,
                'count'   => (int)   $r->count,
            ])
            ->toArray();

        // Revenue by provider
        $providerSplit = Payment::where('status', 'success')
            ->select('provider', DB::raw('SUM(amount) as total'), DB::raw('COUNT(*) as count'))
            ->groupBy('provider')
            ->get()
            ->map(fn ($r) => [
                'provider' => $r->provider,
                'total'    => (float) $r->total,
                'count'    => (int)   $r->count,
            ])
            ->toArray();

        // This-month status breakdown
        $statusBreakdown = Payment::where('created_at', '>=', now()->startOfMonth())
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // New subscribers per month (last 6)
        $newSubs = Subscription::where('created_at', '>=', now()->subMonths(6)->startOfMonth())
            ->select(
                $monthExprSubs,
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month')
            ->toArray();

        return [
            'monthly_revenue'  => $monthly,
            'provider_split'   => $providerSplit,
            'status_breakdown' => $statusBreakdown,
            'new_subs'         => $newSubs,
        ];
    }

    // ─── Activity feed ────────────────────────────────────────────────────────

    private function recentActivity(): array
    {
        return Payment::with(['user:id,name'])
            ->orderByDesc('created_at')
            ->limit(20)
            ->get()
            ->map(fn ($p) => [
                'id'          => $p->id,
                'type'        => $p->status,
                'title'       => match ($p->status) {
                    'success' => "Payment received from {$p->user?->name}",
                    'failed'  => "Payment failed — {$p->user?->name}",
                    'refunded'=> "Refund processed — {$p->user?->name}",
                    default   => "Pending payment — {$p->user?->name}",
                },
                'description' => "{$p->currency} " . number_format($p->amount, 2)
                    . " via " . ucfirst($p->provider)
                    . ($p->failure_reason ? " · {$p->failure_reason}" : ''),
                'time'        => $p->created_at->diffForHumans(),
                'amount'      => (float) $p->amount,
                'status'      => $p->status,
            ])
            ->toArray();
    }

    // ─── Actions ──────────────────────────────────────────────────────────────

    /**
     * Admin: mark a successful payment as refunded and cancel its subscription.
     */
    public function refundPayment(int $id)
    {
        $payment = Payment::findOrFail($id);

        if ($payment->status !== 'success') {
            return back()->with('error', 'Only successful payments can be refunded.');
        }

        DB::transaction(function () use ($payment) {
            $payment->update(['status' => 'refunded']);

            if ($payment->subscription_id) {
                Subscription::where('id', $payment->subscription_id)
                    ->update(['status' => 'cancelled']);

                // Downgrade user package to free
                User::where('id', $payment->user_id)->update(['package' => 'free']);
            }
        });

        Log::info('Admin refunded payment', ['payment_id' => $id, 'admin' => auth()->id()]);

        return back()->with('success', "Payment refunded successfully.");
    }

    /**
     * Admin: force-cancel an active subscription.
     */
    public function cancelSubscription(int $id)
    {
        $sub = Subscription::with('plan')->findOrFail($id);

        $sub->update(['status' => 'cancelled']);

        // Downgrade user package
        User::where('id', $sub->user_id)->update(['package' => 'free']);

        Log::info('Admin cancelled subscription', ['subscription_id' => $id, 'admin' => auth()->id()]);

        return back()->with('success', "Subscription cancelled.");
    }

    /**
     * Admin: grant a free subscription upgrade to an agent.
     *
     * POST /admin/agents/{userId}/grant-subscription
     * Body: { plan_id: int, duration_months: int }
     *
     * Logic:
     *  1. Cancel any current active subscription for the user.
     *  2. Create a new active subscription on the requested plan (no payment).
     *  3. Update user.package to the plan slug.
     *  4. Log the action.
     */
    public function grantSubscription(Request $request, int $userId)
    {
        $request->validate([
            'plan_id'         => 'required|integer|exists:plans,id',
            'duration_months' => 'required|integer|min:1|max:24',
        ]);

        $user = User::findOrFail($userId);
        $plan = Plan::findOrFail($request->plan_id);

        DB::transaction(function () use ($user, $plan, $request) {
            // Cancel existing active subscription
            Subscription::where('user_id', $user->id)
                ->where('status', 'active')
                ->update(['status' => 'cancelled']);

            $months = (int) $request->duration_months;
            $now    = now();

            // Create the complimentary subscription
            Subscription::create([
                'subscription_uuid'             => Subscription::generateUUID(),
                'user_id'                   => $user->id,
                'plan_id'                   => $plan->id,
                'provider'                  => 'admin_grant',
                'provider_subscription_id'  => 'admin_grant_' . $user->id . '_' . $now->timestamp,
                'provider_customer_code'    => null,
                'status'                    => 'active',
                'starts_at'                 => $now,
                'ends_at'                   => $now->copy()->addMonths($months),
                'grace_ends_at'             => $now->copy()->addMonths($months)->addDays(3),
                'meta'                      => [
                    'granted_by'      => auth()->id(),
                    'granted_at'      => $now->toIso8601String(),
                    'reason'          => $request->reason ?? 'Admin grant',
                    'duration_months' => $months,
                ],
            ]);

            // Upgrade user's package field
            $user->update(['package' => $plan->slug]);
        });

        Log::info('Admin granted subscription', [
            'target_user_id'  => $userId,
            'plan_id'         => $plan->id,
            'plan_slug'       => $plan->slug,
            'duration_months' => $request->duration_months,
            'admin_id'        => auth()->id(),
        ]);

        return back()->with('success', "Granted {$plan->name} plan to {$user->name} for {$request->duration_months} month(s).");
    }

    /**
     * Ajax-compatible filter for the payments table.
     * Returns JSON for client-side filtering.
     */
    public function filterPayments(Request $request)
    {
        $query = Payment::with(['user:id,name,email'])->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('provider')) {
            $query->where('provider', $request->provider);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                  ->orWhereHas('user', fn ($u) =>
                      $u->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                  );
            });
        }

        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        return response()->json(
            $query->limit(200)->get()->map(fn ($p) => [
                'id'             => $p->id,
                'reference'      => $p->reference,
                'user'           => $p->user ? ['name' => $p->user->name, 'email' => $p->user->email] : null,
                'amount'         => (float) $p->amount,
                'currency'       => $p->currency,
                'provider'       => $p->provider,
                'status'         => $p->status,
                'failure_reason' => $p->failure_reason,
                'created_at'     => $p->created_at->format('M d, Y H:i'),
            ])
        );
    }
}