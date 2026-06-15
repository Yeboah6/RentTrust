<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\AdminAuditLog;
use App\Mail\AgentInvitation;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\{Hash, Log, DB, Mail};
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AgentsController extends Controller
{
    public function verifyAgent(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:verified,rejected,request_info',
        ]);

        $verify = User::findOrFail($id);
        $oldStatus = $verify->status;
        $verify->update([
            'status' => $validated['status'],
            'updated_at' => now(),
        ]);

        // Audit log
        AdminAuditLog::record('verification', "Agent verification status changed to {$validated['status']}", [
            'affected_user' => $verify->name,
            'affected_id' => $verify->id,
            'notes' => "Status changed from {$oldStatus} to {$validated['status']}",
            'properties' => ['old_status' => $oldStatus, 'new_status' => $validated['status']],
        ]);

        return redirect()->back()->with('success', 'Agent status updated successfully');
    }

    public function suspendAgent(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:suspended,unverified',
        ]);

        $agent = User::findOrFail($id);
        $oldStatus = $agent->status;
        $agent->update([
            'status' => $validated['status'],
            'updated_at' => now(),
        ]);

        // Audit log
        AdminAuditLog::record('suspension', "Agent suspended: {$agent->name}", [
            'affected_user' => $agent->name,
            'affected_id' => $agent->id,
            'notes' => "Agent status changed from {$oldStatus} to {$validated['status']}",
            'properties' => ['old_status' => $oldStatus, 'new_status' => $validated['status']],
        ]);

        return redirect()->back()->with('success', 'Agent status updated successfully');
    }

    // ── Email availability check ──────────────────────────────────────────────
 
    public function checkEmail(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email|max:255']);
 
        $taken = User::where('email', $request->email)->exists();
 
        return response()->json(['taken' => $taken]);
    }

    public function storeAgentByAdmin(Request $request) {

        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'phone'    => ['nullable', 'string', 'max:30', 'unique:users,phone'],
            'fee'     => ['nullable', 'numeric', 'min:0'],
            'company'  => ['nullable', 'string', 'max:255'],
            'type'     => ['nullable', 'string', 'max:100'],
            'bio'      => ['nullable', 'string', 'max:2000'],
            // 'status'   => ['required', Rule::in(['active', 'pending', 'verified'])],
            'location' => ['nullable', 'string', 'max:255']
        ]);

        DB::beginTransaction();

        try{
            $setupToken = Str::random(64);

            $agent = User::create([
            'user_id'                => (string) Str::uuid(),
            'name'                   => $validated['name'],
            'email'                  => $validated['email'],
            'phone'                  => $validated['phone']   ?? null,
            'fee'                   => $validated['fees']    ?? null,
            'company'                => $validated['company'] ?? null,
            'type'                   => $validated['type']    ?? null,
            'bio'                    => $validated['bio']     ?? null,
            'role'                   => 'agent',
            'location'               => $validated['location'] ?? null,
            'package'                => null,
            'status'                 => "pending",
            'password'               => Hash::make(Str::random(32)), // unusable until setup
            'setup_token'            => hash('sha256', $setupToken),
            'setup_token_expires_at' => now()->addHours(48),         // agents get 48hrs
        ]);

        $setupUrl = route('agent.setup', ['token' => $setupToken]);

        // Send invitation email
        Mail::to($agent->email)->send(
            new AgentInvitation(
                agentName: $agent->name,
                agentEmail: $agent->email,
                setupUrl:  $setupUrl,
                expiresAt: $agent->setup_token_expires_at->format('M j, Y g:i A'),
            )
        );

        AdminAuditLog::record('user', 'Agent created', [
            'affected_user' => $agent->name,
            'affected_id'   => $agent->id,
            'notes' => 'Admin created a new agent account and sent invitation email.',
            'properties' => [
                'email' => $agent->email,
                'phone' => $agent->phone,
                'company' => $agent->company,
                'status' => $agent->status,
            ],
        ]);

        DB::commit();

        return redirect()->back()->with('success', 'Agent created successfully and invitation email sent');

        } catch(\Throwable $e) {
            DB::rollBack();
            Log::error('Agent creation failed', ['error' => $e->getMessage()]);

            return back()->withErrors(['email' => $e->getMessage()]);

        }
    }

    public function updateAgentByAdmin(Request $request, $id) {
        $validated = $request->validate([
            'name'=>'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'phone'=>'nullable|string|max:15|unique:users,phone,' . $id,
            'bio'=>'nullable|string|max:500',
            'company'=>'nullable|string|max:255',
            'fee'=>'nullable|numeric|min:0',
            'location'=>'nullable|string|max:255',
            'role' => ['nullable', Rule::in(['agent', 'admin'])],
        ]);

        $agent = User::where('id', $id)
            ->where('role', 'agent')
            ->firstOrFail();

        $agent->update([
            'name' => $validated['name'] ?? $agent->name,
            'email' => $validated['email'] ?? $agent->email,
            'phone' => $validated['phone'] ?? $agent->phone,
            'bio' => $validated['bio'] ?? $agent->bio,
            'company' => $validated['company'] ?? $agent->company,
            'fee' => $validated['fee'] ?? $agent->fee,
            'location' => $validated['location'] ?? $agent->location,
            'role' => $validated['role'] ?? $agent->role,
        ]);

        AdminAuditLog::record('user', 'Agent updated', [
            'affected_user' => $agent->name,
            'affected_id' => $agent->id,
            'notes' => 'Admin updated agent details.',
            'properties' => $request->only(['name', 'email', 'phone', 'company', 'bio', 'fee', 'location']),
        ]);

        return redirect()->back()->with('success', 'Agent updated successfully');
    }

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

        AdminAuditLog::record('subscription', 'Subscription granted', [
            'affected_user' => $user->name,
            'affected_id' => $user->id,
            'notes' => "Admin granted {$plan->name} plan for {$request->duration_months} month(s).",
            'properties' => [
                'plan_id' => $plan->id,
                'plan_slug' => $plan->slug,
                'duration_months' => $request->duration_months,
                'granted_by' => auth()->id(),
            ],
        ]);

        return back()->with('success', "Granted {$plan->name} plan to {$user->name} for {$request->duration_months} month(s).");
    }

    public function resendInvitation($id)
    {
        $agent = User::where('id', $id)
            ->where('role', 'agent')
            ->firstOrFail();

        // Generate setup/invitation URL
        $setupToken = Str::random(64);
        $setupUrl = route('agent.setup', ['token' => $setupToken, 'email' => $agent->email]);
        $expiresAt = now()->addDays(7)->toDateTimeString();

        // Send invitation email
        Mail::to($agent->email)->send(new AgentInvitation(
            $agent->name,
            $agent->email,
            $setupUrl,
            $expiresAt
        ));

        AdminAuditLog::record('user', 'Invitation resent', [
            'affected_user' => $agent->name,
            'affected_id' => $agent->id,
            'notes' => 'Admin resent invitation email to agent.',
            'properties' => [
                'email' => $agent->email,
                'resent_by' => auth()->id(),
            ],
        ]);

        return back()->with('success', "Invitation email resent to {$agent->name}");
    }

}