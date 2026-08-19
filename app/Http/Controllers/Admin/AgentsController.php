<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\AdminAuditLog;
use App\Mail\AgentInvitation;
use App\Models\AgentVerification;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\{Hash, Log, DB, Mail, Auth, Storage};
use App\Mail\AgentAccountUpdated;
use App\Mail\AgentSuspended;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AgentsController extends Controller
{

    public function suspendAgent(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:suspended,unverified',
            'reason' => 'nullable|string|max:500',
        ]);

        $agent = User::findOrFail($id);
        $oldStatus = $agent->status;
        $agent->update([
            'status' => $validated['status'],
            'updated_at' => now(),
        ]);

        if ($validated['status'] === 'suspended') {
            AgentVerification::where('agent_id', $agent->id)
                ->update([
                    'status' => 'rejected',
                    'reviewed_at' => now(),
                    'reviewed_by' => auth()->user()?->name,
                ]);
        }

        // Audit log
        AdminAuditLog::record('suspension', "Agent suspended: {$agent->name}", [
            'affected_user' => $agent->name,
            'affected_id' => $agent->id,
            'notes' => "Agent status changed from {$oldStatus} to {$validated['status']}",
            'properties' => ['old_status' => $oldStatus, 'new_status' => $validated['status']],
        ]);

        // Notify agent (suspension or reactivation)
        Mail::to($agent->email)->send(
            new AgentSuspended($agent, auth()->user(), $validated['status'], $validated['reason'] ?? null)
        );

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
            'status'                 => "unverified",
            'password'               => Hash::make(Str::random(32)), 
            'setup_token'            => hash('sha256', $setupToken),
            'setup_token_expires_at' => now()->addHours(48),         
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

    public function updateAgentByAdmin(Request $request, $id)
    {
        $validated = $request->validate([
            'name'    => 'nullable|string|max:255',
            'email'   => 'nullable|email|unique:users,email,' . $id,
            'phone'   => 'nullable|string|max:15|unique:users,phone,' . $id,
            'bio'     => 'nullable|string|max:500',
            'company' => 'nullable|string|max:255',
            'fee'     => 'nullable|numeric|min:0',
            'location'=> 'nullable|string|max:255',
            'role'    => ['nullable', Rule::in(['agent', 'landlord'])],
        ]);

        $agent = User::where('id', $id)
            ->whereIn('role', ['agent', 'landlord'])
            ->firstOrFail();

        $before = $agent->only(['name', 'email', 'phone', 'bio', 'company', 'fee', 'location', 'role']);

        $agent->update([
            'name'     => $validated['name'] ?? $agent->name,
            'email'    => $validated['email'] ?? $agent->email,
            'phone'    => $validated['phone'] ?? $agent->phone,
            'bio'      => $validated['bio'] ?? $agent->bio,
            'company'  => $validated['company'] ?? $agent->company,
            'fee'      => $validated['fee'] ?? $agent->fee,
            'location' => $validated['location'] ?? $agent->location,
            'role'     => $validated['role'] ?? $agent->role,
        ]);

        $after = $agent->only(['name', 'email', 'phone', 'bio', 'company', 'fee', 'location', 'role']);
        $changedFields = [];

        foreach ($after as $field => $value) {
            if ($before[$field] !== $value) {
                $changedFields[$field] = [
                    'from' => $before[$field],
                    'to' => $value,
                ];
            }
        }

        AdminAuditLog::record('user', 'Agent updated', [
            'affected_user' => $agent->name,
            'affected_id'   => $agent->id,
            'notes'         => 'Admin updated agent details.',
            'properties'    => $changedFields,
        ]);

        if (!empty($changedFields)) {
            Mail::to($agent->email)->send(new AgentAccountUpdated($agent, $changedFields, auth()->user()));
        }

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
        $months = (int) $request->duration_months;

        DB::transaction(function () use ($user, $plan, $request, $months) {
            // Cancel existing active subscription
            Subscription::where('user_id', $user->id)
                ->where('status', 'active')
                ->update(['status' => 'cancelled']);

            $now = now();

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
            'duration_months' => $months,
            'admin_id'        => auth()->id(),
        ]);

        AdminAuditLog::record('subscription', 'Subscription granted', [
            'affected_user' => $user->name,
            'affected_id' => $user->id,
            'notes' => "Admin granted {$plan->name} plan for {$months} month(s).",
            'properties' => [
                'plan_id' => $plan->id,
                'plan_slug' => $plan->slug,
                'duration_months' => $months,
                'granted_by' => auth()->id(),
            ],
        ]);

        // Notify the user
        $expiresOn = now()->addMonths($months)->format('F j, Y');
        Mail::raw(
            "Hi {$user->name},\n\n" .
            "Great news — your account has been upgraded to the {$plan->name} plan by our team.\n\n" .
            "Duration: {$months} month(s)\n" .
            "Expires on: {$expiresOn}\n\n" .
            "You can now enjoy all the benefits of your new plan on RentTrustGH.\n\n" .
            "Best,\nThe RentTrustGH Team",
            function ($message) use ($user, $plan) {
                $message->to($user->email)
                    ->subject("You've Been Upgraded to {$plan->name} — RentTrustGH");
            }
        );

        return back()->with('success', "Granted {$plan->name} plan to {$user->name} for {$months} month(s).");
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

    public function approveAgentVerification(Request $request, AgentVerification $agentVerification)
    {
        $validated = $request->validate([
            'admin_notes' => 'nullable|string',
        ]);

        $oldStatus = $agentVerification->status;

        $agentVerification->update([
            'status' => 'approved',
            'admin_notes' => $validated['admin_notes'] ?: $agentVerification->admin_notes,
            'reviewed_at' => now(),
            'reviewed_by' => Auth::user()->name,
        ]);

        $agentVerification->agent()->update([
            'status'      => 'verified',
        ]);

        Mail::raw(
            "Hi {$agentVerification->agent_name},\n\n" .
            "Good news — your RentTrustGH agent verification has been approved. " .
            "Your account is now marked as verified.\n\n" .
            "RentTrustGH",
            function ($message) use ($agentVerification) {
                $message->to($agentVerification->email)
                    ->subject('You\'re verified on RentTrustGH');
            }
        );

        AdminAuditLog::record('agent_verification', "Approved agent verification: {$agentVerification->agent_name}", [
            'affected_user' => $agentVerification->agent_name,
            'affected_id' => $agentVerification->agent_id,
            'notes' => "Agent verification status changed from {$oldStatus} to approved",
            'properties' => [
                'old_status' => $oldStatus,
                'new_status' => 'approved',
                'verification_id' => $agentVerification->id,
            ],
        ]);

        return back()->with('success', 'Agent verification approved.');
    }

    public function rejectAgentVerification(Request $request, AgentVerification $agentVerification)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string',
        ]);

        $oldStatus = $agentVerification->status;

        $agentVerification->update([
            'status' => 'rejected',
            'admin_notes' => $validated['rejection_reason'],
            'reviewed_at' => now(),
            'reviewed_by' => Auth::user()->name,
        ]);

        Mail::raw(
            "Hi {$agentVerification->agent_name},\n\n" .
            "We reviewed your verification submission and weren't able to approve it this time.\n\n" .
            "Reason: {$validated['rejection_reason']}\n\n" .
            "You can update your documents and resubmit from your account settings.\n\n" .
            "RentTrustGH",
            function ($message) use ($agentVerification) {
                $message->to($agentVerification->email)
                    ->subject('Update on your RentTrustGH verification');
            }
        );

        AdminAuditLog::record('agent_verification', "Rejected agent verification: {$agentVerification->agent_name}", [
            'affected_user' => $agentVerification->agent_name,
            'affected_id' => $agentVerification->agent_id,
            'notes' => "Agent verification status changed from {$oldStatus} to rejected",
            'properties' => [
                'old_status' => $oldStatus,
                'new_status' => 'rejected',
                'verification_id' => $agentVerification->id,
            ],
        ]);

        return back()->with('success', 'Agent verification rejected.');
    }

    public function downloadDocument(Request $request, AgentVerification $verification, string $filename)
    {
        $filename = urldecode($filename);
    
        $fields = ['gov_id', 'license_documents', 'proof_of_address'];
        $foundFile = null;
    
        foreach ($fields as $field) {
            foreach ($this->parseDocumentField($verification->{$field}) as $entry) {
                $path = is_array($entry) ? ($entry['url'] ?? $entry['path'] ?? '') : $entry;
                if ($path && (basename($path) === $filename || $path === $filename)) {
                    $foundFile = $path;
                    break 2;
                }
            }
        }
    
        if (!$foundFile) {
            abort(404, 'Document not found');
        }
    
        $filePath = 'agent_verification_documents/' . basename($foundFile);
    
        if (!Storage::disk('public')->exists($filePath)) {
            abort(404, 'Document not found on disk');
        }
    
        return Storage::disk('public')->download($filePath, $filename);
    }

}