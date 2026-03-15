<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\SubscriptionAuditLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\AdminAuditLog;

class SubscriptionController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:super_admin']);
    }

    public function index()
    {
        $subscriptions = Subscription::with(['user', 'plan'])
            ->latest()
            ->get()
            ->map(fn ($s) => $this->formatSubscription($s));

        return inertia('SuperAdmin/Subscriptions/Index', [
            'subscriptions' => $subscriptions,
        ]);
    }

    public function show($id)
    {
        $sub = Subscription::with(['user', 'plan'])->findOrFail($id);

        $auditLogs = AdminAuditLog::with('admin')
            ->where('subscription_id', $id)
            ->latest()
            ->get()
            ->map(fn ($log) => [
                'id'         => $log->id,
                'action'     => $log->action,
                'notes'      => $log->notes,
                'meta'       => $log->meta,
                'admin_name' => $log->admin?->name ?? 'System',
                'created_at' => $log->created_at,
            ]);

        return inertia('SuperAdmin/Subscriptions/SubscriptionShow', [
            'subscription' => $this->formatSubscription($sub),
            'audit_logs'   => $auditLogs,
            'plans'        => Plan::orderBy('price')->get(['id', 'name', 'slug', 'price', 'billing_cycle']),
        ]);
    }

    public function cancel($id)
    {
        $sub = Subscription::with('plan')->findOrFail($id);

        abort_if($sub->status === 'cancelled', 422, 'Subscription is already cancelled.');

        DB::transaction(function () use ($sub) {
            $previousStatus = $sub->status;

            $sub->update(['status' => 'cancelled']);

            // Downgrade user package to free
            User::where('id', $sub->user_id)->update(['package' => 'free']);

            $this->auditLog($sub->id, 'cancel', [
                'previous_status' => $previousStatus,
                'plan_name'       => $sub->plan?->name,
                'user_id'         => $sub->user_id,
            ], 'Subscription cancelled by admin. User downgraded to free.');

            Log::info('SuperAdmin cancelled subscription', [
                'subscription_id' => $sub->id,
                'user_id'         => $sub->user_id,
                'plan'            => $sub->plan?->name,
                'previous_status' => $previousStatus,
                'admin_id'        => Auth::id(),
            ]);
        });

        return back()->with('success', 'Subscription cancelled and user downgraded to Free.');
    }

    public function suspend($id)
    {
        $sub = Subscription::with('plan')->findOrFail($id);

        abort_if($sub->status === 'suspended', 422, 'Subscription is already suspended.');

        DB::transaction(function () use ($sub) {
            $previousStatus = $sub->status;

            $sub->update(['status' => 'suspended']);

            $this->auditLog($sub->id, 'suspend', [
                'previous_status' => $previousStatus,
                'plan_name'       => $sub->plan?->name,
                'user_id'         => $sub->user_id,
            ], 'Subscription suspended by admin. Paid features access removed immediately.');

            Log::info('SuperAdmin suspended subscription', [
                'subscription_id' => $sub->id,
                'user_id'         => $sub->user_id,
                'plan'            => $sub->plan?->name,
                'previous_status' => $previousStatus,
                'admin_id'        => Auth::id(),
            ]);
        });

        return back()->with('success', 'Account suspended. User has lost access to paid features.');
    }

    public function extend(Request $request, $id)
    {
        $request->validate(['days' => 'required|integer|min:1|max:365']);

        $sub  = Subscription::with('plan')->findOrFail($id);
        $days = (int) $request->days;

        DB::transaction(function () use ($sub, $days) {
            $previousRenewsAt = $sub->renews_at;

            $newRenewsAt = $sub->renews_at
                ? \Carbon\Carbon::parse($sub->renews_at)->addDays($days)
                : now()->addDays($days);

            $sub->update(['renews_at' => $newRenewsAt]);

            $this->auditLog($sub->id, 'free_month', [
                'days_granted'      => $days,
                'previous_renews_at'=> $previousRenewsAt,
                'new_renews_at'     => $newRenewsAt,
                'plan_name'         => $sub->plan?->name,
                'user_id'           => $sub->user_id,
            ], "Admin granted {$days} free day(s). Renewal date extended.");

            Log::info('SuperAdmin granted free extension', [
                'subscription_id'    => $sub->id,
                'user_id'            => $sub->user_id,
                'plan'               => $sub->plan?->name,
                'days_granted'       => $days,
                'previous_renews_at' => $previousRenewsAt,
                'new_renews_at'      => $newRenewsAt,
                'admin_id'           => Auth::id(),
            ]);
        });

        return back()->with('success', "Renewal date extended by {$days} day(s).");
    }

    public function upgrade(Request $request, int $id)
    {
        $request->validate(['plan_id' => 'required|exists:plans,id']);
    
        $sub  = Subscription::with(['plan', 'user'])->findOrFail($id);
        $plan = Plan::findOrFail($request->plan_id);
    
        abort_if($sub->plan_id === $plan->id, 422, 'User is already on this plan.');
    
        DB::transaction(function () use ($sub, $plan) {
            $previousPlan = $sub->plan?->name;
    
            // 1. Cancel the current subscription
            $sub->update(['status' => 'cancelled']);
    
            // 2. Create new active subscription for the user
            $newSub = Subscription::create([
                'user_id'   => $sub->user_id,
                'plan_id'   => $plan->id,
                'status'    => 'active',
                'provider' => 'super_admin_grant',
                'starts_at' => now(),
                'grace_ends_at' => now()->addMonth()->addDays(3),
                'ends_at' => now()->addMonth(),
                'renews_at' => now()->addMonth(),
            ]);
    
            // 3. Update user package
            User::where('id', $sub->user_id)->update([
                'package' => $plan->slug,
                'status' => 'verified'
                ]);
    
            // 4. Audit old subscription
            $this->auditLog($sub->id, 'upgrade', [
                'previous_plan_id'    => $sub->plan_id,
                'previous_plan_name'  => $previousPlan,
                'new_plan_id'         => $plan->id,
                'new_plan_name'       => $plan->name,
                'new_subscription_id' => $newSub->id,
                'user_id'             => $sub->user_id,
            ], "Plan changed from '{$previousPlan}' to '{$plan->name}'. New subscription #{$newSub->id} created.");
    
            // 5. Audit new subscription
            $this->auditLog($newSub->id, 'created_via_upgrade', [
                'previous_subscription_id' => $sub->id,
                'previous_plan_name'       => $previousPlan,
                'plan_name'                => $plan->name,
                'user_id'                  => $sub->user_id,
            ], "Subscription created by admin upgrade from '{$previousPlan}'.");
    
            // 6. System log — Log::info(), NOT AdminAuditLog::info() (that method does not exist)
            Log::info('SuperAdmin upgraded subscription', [
                'old_subscription_id' => $sub->id,
                'new_subscription_id' => $newSub->id,
                'user_id'             => $sub->user_id,
                'previous_plan'       => $previousPlan,
                'new_plan'            => $plan->name,
                'new_plan_slug'       => $plan->slug,
                'admin_id'            => Auth::id(),
            ]);
        });
    
        return back()->with('success', "User upgraded to {$plan->name} successfully.");
    }

    private function formatSubscription(Subscription $s): array
    {
        return [
            'id'             => $s->id,
            'sub_ref'        => $s->sub_ref ?? 'SUB-' . str_pad($s->id, 4, '0', STR_PAD_LEFT),
            'user_id'        => $s->user_id,
            'user_name'      => $s->user?->name      ?? '—',
            'email'          => $s->user?->email     ?? '',
            'plan_name'      => $s->plan?->name      ?? '—',
            'plan_price'     => $s->plan?->price     ?? 0,
            'plan_cycle'     => $s->plan?->billing_cycle ?? 'month',
            'status'         => $s->status,
            'on_grace_period'=> (bool) ($s->on_grace_period ?? false),
            'days_left'      => $s->days_left ?? null,
            'payment_method' => $s->payment_method ?? '—',
            'created_at'     => $s->created_at,
            'renews_at'      => $s->renews_at ?? $s->ends_at,
            'starts_at'      => $s->starts_at,
        ];
    }

    private function auditLog(int $subscriptionId, string $action, array $meta = [], string $notes = ''): void
    {
        SubscriptionAuditLog::create([
            'subscription_id' => $subscriptionId,
            'admin_id'        => Auth::id(),
            'action'          => $action,
            'notes'           => $notes,
            'meta'            => $meta,
        ]);
    }

    public function grant(Request $request)
    {
        $request->validate([
            'user_id'         => 'required|exists:users,id',
            'plan_id'         => 'required|exists:plans,id',
            'duration_months' => 'required|integer|min:1|max:24',
        ]);

        $userId   = $request->user_id;
        $plan     = Plan::findOrFail($request->plan_id);
        $months   = (int) $request->duration_months;

        DB::transaction(function () use ($userId, $plan, $months) {
            // Cancel any existing active subscriptions
            $cancelled = Subscription::where('user_id', $userId)
                ->whereIn('status', ['active', 'trial'])
                ->get();

            foreach ($cancelled as $existing) {
                $existing->update(['status' => 'cancelled']);

                $this->auditLog($existing->id, 'cancelled_for_grant', [
                    'user_id'    => $userId,
                    'new_plan'   => $plan->name,
                ], 'Previous subscription cancelled to apply admin-granted plan.');
            }

            // Create new admin-granted subscription
            $newSub = Subscription::create([
                'user_id'        => $userId,
                'plan_id'        => $plan->id,
                'status'         => 'active',
                'payment_method' => 'admin_grant',
                'starts_at'      => now(),
                'renews_at'      => now()->addMonths($months),
                'created_at'     => now(),
            ]);

            // Update user package
            User::where('id', $userId)->update(['package' => $plan->slug]);

            $this->auditLog($newSub->id, 'admin_grant', [
                'target_user_id'  => $userId,
                'plan_id'         => $plan->id,
                'plan_slug'       => $plan->slug,
                'duration_months' => $months,
                'expires_at'      => now()->addMonths($months),
            ], "Admin granted {$months} month(s) of '{$plan->name}' at no charge.");

            SubscriptionAuditLog::info('Admin granted subscription', [
                'target_user_id'  => $userId,
                'plan_id'         => $plan->id,
                'plan_slug'       => $plan->slug,
                'duration_months' => $months,
                'admin_id'        => Auth::id(),
            ]);
        });

        return back()->with('success', "Granted {$months} month(s) of {$plan->name} to the user.");
    }
}
