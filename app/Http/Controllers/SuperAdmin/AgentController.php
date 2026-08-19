<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Rental;
use App\Models\AdminAuditLog;
use App\Models\AgentVerification;
use Illuminate\Support\Facades\{DB, Hash, Log, Storage, Mail};
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Mail\AgentInvitation;
use App\Mail\AgentSuspended;
use App\Mail\AgentReactivated;
use Illuminate\Support\Str;

class AgentController extends Controller
{
    public function index()
    {
        $agents = User::where('role', 'agent')
            ->withCount([
                'rentals as listings_count',
                'rentals as active_listings' => fn($q) => $q->where('status', 'active')->where('is_sold', false),
                'rentals as sold_count'      => fn($q) => $q->where('is_sold', true),
                'reviews as reviews_count',
            ])
            ->withAvg('reviews as rating', 'overall_rating')
            ->with(['subscription.plan', 'verification'])   // for tier/package
            ->addSelect([
                'users.*',
            ])
            ->get()
            ->map(function (User $user) {
                return [
                    'id'              => $user->id,
                    'name'            => $user->name,
                    'email'           => $user->email,
                    'phone'           => $user->phone,
                    'status'          => $user->status ?? 'pending',
                    'type'            => $user->type,
                    'company'         => $user->company,
                    'bio'             => $user->bio,
                    'listings_count'  => $user->listings_count  ?? 0,
                    'active_listings' => $user->active_listings ?? 0,
                    'sold_count'      => $user->sold_count      ?? 0,
                    'rating'          => $user->rating ?? 0.0,
                    'reviews_count'   => $user->reviews_count ?? 0,
                    'joined_at'       => $user->created_at,
                    'last_active'     => $user->last_active,
                    'is_verified'              => $user->verification?->status === 'approved',
                    'has_verification_submission' => (bool) $user->verification,
                ];
            });

        $listings_count = Rental::count();

        return inertia('SuperAdmin/Agents/Index', [
            'agents'         => $agents,
            'listings_count' => $listings_count,
            'plans'          => \App\Models\Plan::active()->orderBy('sort_order')->get(),
        ]);
    }

    // ─── Create ───────────────────────────────────────────────────────────────
 
    public function create()
    {
        return Inertia::render('SuperAdmin/Agents/AgentCreate');
    }

    // ─── Store ────────────────────────────────────────────────────────────────
 
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'phone'    => ['nullable', 'string', 'max:30', 'unique:users,phone'],
            'fee'     => ['nullable', 'numeric', 'min:0'],
            'company'  => ['nullable', 'string', 'max:255'],
            'type'     => ['nullable', 'string', 'max:100'],
            'bio'      => ['nullable', 'string', 'max:2000'],
            'status'   => ['required', Rule::in(['active', 'pending', 'verified'])],
            'location' => ['nullable', 'string', 'max:255']
        ]);

        DB::beginTransaction();

        try {
        $setupToken = Str::random(64);

        $agent = User::create([
            'user_id'                => (string) Str::uuid(),
            'name'                   => $validated['name'],
            'email'                  => $validated['email'],
            'phone'                  => $validated['phone']   ?? null,
            'fee'                    => $validated['fees']    ?? null,
            'company'                => $validated['company'] ?? null,
            'type'                   => $validated['type']    ?? null,
            'bio'                    => $validated['bio']     ?? null,
            'role'                   => 'agent',
            'location'               => $validated['location'] ?? null,
            'package'                => null,
            'status'                 => $validated['status'],
            'password'               => Hash::make(Str::random(32)), // unusable until setup
            'setup_token'            => hash('sha256', $setupToken),
            'setup_token_expires_at' => now()->addHours(48),         // agents get 48hrs
        ]);

        $setupUrl = route('agent.setup', ['token' => $setupToken]);

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
            'notes'         => 'Agent account created and invitation sent via email.',
            'properties'    => ['email' => $agent->email, 'type' => $agent->type],
        ]);

        DB::commit();

        return redirect()
            ->route('super-admin.agents.index')
            ->with('success', "Agent \"{$agent->name}\" created. Invitation sent to {$agent->email}.");

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Agent creation failed', ['error' => $e->getMessage()]);

            return back()->withErrors(['email' => $e->getMessage()]);
        }
    }

    public function resendInvitation(Request $request, User $user)
    {
        if ($user->role !== 'agent') {
            return back()->withErrors(['email' => 'This user is not an agent account.']);
        }

        DB::beginTransaction();

        try {
            $setupToken = Str::random(64);

            $user->update([
                'setup_token'            => hash('sha256', $setupToken),
                'setup_token_expires_at' => now()->addHours(48),
                'status'                 => 'pending',
            ]);

            $setupUrl = route('agent.setup', ['token' => $setupToken]);

            Mail::to($user->email)->send(
                new AgentInvitation(
                    agentName: $user->name,
                    agentEmail: $user->email,
                    setupUrl: $setupUrl,
                    expiresAt: $user->setup_token_expires_at->format('M j, Y g:i A'),
                )
            );

            AdminAuditLog::record('user', 'Agent invitation resent', [
                'affected_user' => $user->name,
                'affected_id'   => $user->id,
                'notes'         => 'Agent invitation resent via email.',
                'properties'    => ['email' => $user->email, 'role' => $user->role],
            ]);

            DB::commit();

            return back()->with('success', 'Invitation email resent successfully!');

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Agent resend invitation failed', [
                'error' => $e->getMessage(),
                'agent_id' => $user->id,
            ]);

            return back()->withErrors(['email' => 'Failed to resend invitation. Please try again.']);
        }
    }


    // ─── Show ─────────────────────────────────────────────────────────────────
 
    public function show(User $agent)
    {
        $agent->loadCount([
            'rentals as listings_count',
            'rentals as active_listings' => fn ($q) => $q->where('status', 'approved'),
            'rentals as sold_count'      => fn ($q) => $q->where('is_sold', true),
            'reviews as reviews_count',          // ← add this
        ]);

        $agent->loadAvg('reviews as rating', 'overall_rating');
 
        // Load every listing for this agent so the page can show full listing details, not just counts.
        $listings = Rental::where('user_id', $agent->id)
            ->orWhere('agent_id', $agent->id)
            ->latest()
            ->get()
            ->map(fn ($l) => $this->formatListingPreview($l));
 
        return Inertia::render('SuperAdmin/Agents/AgentShow', [
            'agent' => array_merge($this->formatAgent($agent), ['listings' => $listings]),
        ]);
    }

    // ─── Edit ─────────────────────────────────────────────────────────────────
 
    public function edit(User $agent)
    {
        $agent->loadCount([
            'rentals as listings_count',
            'rentals as sold_count' => fn ($q) => $q->where('is_sold', true),
        ]);
 
        return Inertia::render('SuperAdmin/Agents/AgentEdit', [
            'agent' => $this->formatAgent($agent),
        ]);
    }

    // ─── Update ───────────────────────────────────────────────────────────────
 
    public function update(Request $request, User $agent)
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'email', Rule::unique('users', 'email')->ignore($agent->id)],
            'phone'       => ['nullable', 'string', 'max:30'],
            'company'      => ['nullable', 'string', 'max:255'],
            'type'      => ['nullable', 'string', 'max:100'],
            'location'    => ['nullable', 'string', 'max:255'],
            'bio'         => ['nullable', 'string', 'max:2000'],
            'status'      => ['required', Rule::in(['active', 'pending', 'verified', 'suspended', 'rejected', 'inactive'])],
            'is_verified' => ['boolean'],
            'password'    => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);
 
        $original = $agent->only(['name', 'email', 'phone', 'company', 'type', 'location', 'bio', 'status', 'is_verified']);
        $changes = [];
 
        DB::transaction(function () use ($agent, $validated, $original, &$changes) {
            $fillable = collect($validated)->except(['password', 'password_confirmation'])->toArray();
 
            $agent->update($fillable);
 
            foreach (['name', 'email', 'phone', 'company', 'type', 'location', 'bio', 'status', 'is_verified'] as $field) {
                $before = $original[$field] ?? null;
                $after = $agent->{$field} ?? null;
                if ($before !== $after) {
                    $changes[$field] = ['from' => $before, 'to' => $after];
                }
            }
 
            // Update password only if provided
            if (!empty($validated['password'])) {
                $agent->update(['password' => Hash::make($validated['password'])]);
                $changes['password'] = ['from' => '(hidden)', 'to' => '(changed)'];
 
                if ($agent->user) {
                    $agent->user->update(['password' => Hash::make($validated['password'])]);
                }
            }
        });
 
        try {
            $changeLines = collect($changes)
                ->map(function ($update, $field) {
                    $label = ucfirst(str_replace('_', ' ', $field));
                    $from  = $field === 'password' ? '••••••••' : ($update['from'] ?? '—');
                    $to    = $field === 'password' ? '(changed)' : ($update['to']   ?? '—');
                    return "  • {$label}: {$from} → {$to}";
                })
                ->join("\n");

            $body = !empty($changes)
                ? "The following details were updated:\n\n{$changeLines}"
                : "Your account was reviewed but no details were changed.";

            Mail::raw(
                "Hello {$agent->name},\n\n" .
                "Your agent account on " . config('app.name') . " was updated by an administrator.\n\n" .
                "{$body}\n\n" .
                "If you did not expect this change, please contact support immediately.\n\n" .
                "Thank you.\n",
                function ($message) use ($agent) {
                    $message->to($agent->email, $agent->name)
                        ->subject('Your Agent Account Has Been Updated');
                }
            );
        } catch (\Throwable $e) {
            Log::warning('Failed to send agent account updated email', [
                'error'    => $e->getMessage(),
                'agent_id' => $agent->id,
            ]);
        }
 
        AdminAuditLog::record('user', 'Agent updated', [
            'affected_user' => $agent->name,
            'affected_id'   => $agent->id,
            'notes'         => 'Agent account updated by ' . (auth()->user()?->name ?? 'System'),
            'properties'    => ['changes' => $changes],
        ]);
 
        Log::info('SuperAdmin updated agent', [
            'user_id' => $agent->id,
            'admin_id' => auth()->id(),
        ]);
 
        return redirect()
            ->route('super-admin.agents.show', $agent)
            ->with('success', 'Agent account updated successfully.');
    }

    // ─── Suspend ──────────────────────────────────────────────────────────────
 
    public function suspend(User $agent)
    {
        if ($agent->status === 'suspended') {
            return back()->with('error', 'Agent is already suspended.');
        }

        $previousStatus = $agent->status;

        $agent->update([
            'status'          => 'suspended',
            // 'suspended_at'    => now(),
            // 'suspended_by'    => auth()->id(),
            'previous_status' => $previousStatus,
        ]);

        try {
            Mail::to($agent->email)->send(
                new AgentSuspended(
                    agent: $agent,
                    suspendedBy: auth()->user(),
                    status: 'suspended',
                    reason: 'Account suspended by an administrator.',
                )
            );
        } catch (\Throwable $e) {
            Log::warning('Failed to send agent suspended email', [
                'error'    => $e->getMessage(),
                'agent_id' => $agent->id,
            ]);
        }

        AdminAuditLog::record('suspension', "Agent suspended: {$agent->name}", [
            'affected_user' => $agent->name,
            'affected_id'   => $agent->id,
            'notes'         => "Agent {$agent->email} has been suspended. Previous status: {$previousStatus}",
            'properties'    => ['agent_id' => $agent->id, 'previous_status' => $previousStatus, 'suspended_by' => auth()->id()],
        ]);

        Log::info('SuperAdmin suspended agent', [
            'user_id'  => $agent->id,
            'admin_id' => auth()->id(),
        ]);

        return back()->with('success', "{$agent->name} has been suspended.");
    }

     // ─── Reactivate ───────────────────────────────────────────────────────────
 
    public function reactivate(User $agent)
    {
        if ($agent->status !== 'suspended') {
            return back()->with('error', 'Agent is not suspended.');
        }

        $restoreStatus = $agent->previous_status ?? ($agent->is_verified ? 'verified' : 'pending');

        $agent->update([
            'status'          => $restoreStatus,
        ]);

        try {
            Mail::to($agent->email)->send(
                new AgentReactivated(
                    agent: $agent,
                    reactivatedBy: auth()->user(),
                )
            );
        } catch (\Throwable $e) {
            Log::warning('Failed to send agent reactivated email', [
                'error'    => $e->getMessage(),
                'agent_id' => $agent->id,
            ]);
        }

        AdminAuditLog::record('suspension', "Agent reactivated: {$agent->name}", [
            'affected_user' => $agent->name,
            'affected_id'   => $agent->id,
            'notes'         => "Agent {$agent->email} has been reactivated. Restored status: {$restoreStatus}",
            'properties'    => ['agent_id' => $agent->id, 'restored_status' => $restoreStatus, 'reactivated_by' => auth()->id()],
        ]);

        Rental::where('agent_id', $agent->id)
            ->where('status', 'suspended')
            ->update(['status' => 'active']);

        Log::info('SuperAdmin reactivated agent', [
            'agent_id' => $agent->id,
            'admin_id' => auth()->id(),
        ]);

        return back()->with('success', "{$agent->name} has been reactivated.");
    }
    // ─── Delete ───────────────────────────────────────────────────────────────
 
    public function destroy(User $agent)
    {
        $name    = $agent->name;
        $email   = $agent->email;
        $agentId = $agent->id;

        DB::transaction(function () use ($agent) {
            if ($agent->avatar && !str_starts_with($agent->avatar, 'http')) {
                Storage::disk('public')->delete($agent->avatar);
            }

            $agent->payments()->delete();

            $listings = Rental::where('agent_id', $agent->id)->get();
            foreach ($listings as $listing) {
                if (!empty($listing->images)) {
                    foreach ($listing->images as $img) {
                        $path = is_array($img) ? ($img['path'] ?? '') : $img;
                        if ($path && !str_starts_with($path, 'http')) {
                            Storage::disk('public')->delete(ltrim($path, '/'));
                        }
                    }
                }
                $listing->inquiries()->delete();
                $listing->delete();
            }

            $agent->user?->delete();
            $agent->delete();
        });

        AdminAuditLog::record('user', 'Agent deleted', [
            'affected_user' => $name,
            'affected_id'   => $agentId,
            'notes'         => 'Agent account and all associated listings permanently deleted.',
            'properties'    => ['email' => $email],
        ]);

        try {
            Mail::raw(
                "Hi {$name},\n\n" .
                "Your RentTrustGH agent account has been permanently deleted by an RentTrustGh.\n\n" .
                "Any associated data tied to this account has also been removed.\n\n" .
                "RentTrustGH",
                function ($message) use ($email, $name) {
                    $message->to($email, $name)
                        ->subject('Your RentTrustGH agent account has been deleted');
                }
            );
        } catch (\Throwable $e) {
            Log::warning('Failed to send agent deletion email', [
                'agent_email' => $email,
                'error'       => $e->getMessage(),
            ]);
        }

        Log::info('SuperAdmin deleted agent', [
            'agent_name' => $name,
            'admin_id'   => auth()->id(),
        ]);

        return redirect()
            ->route('super-admin.agents.index')
            ->with('success', "Agent \"{$name}\" and all their data have been permanently deleted.");
    }

    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'agent_ids'   => ['required', 'array', 'min:1'],
            'agent_ids.*' => ['integer', 'exists:users,id'],
            'subject'     => ['required', 'string', 'max:150'],
            'message'     => ['required', 'string', 'max:5000'],
        ]);
    
        $agents = User::whereIn('id', $validated['agent_ids'])
            ->where('role', 'agent')
            ->get();
    
        $sentCount   = 0;
        $failedNames = [];
    
        foreach ($agents as $agent) {
            if (empty($agent->email)) {
                $failedNames[] = $agent->name;
                continue;
            }
    
            try {
                Mail::raw($validated['message'], function ($mail) use ($agent, $validated) {
                    $mail->to($agent->email, $agent->name)
                         ->subject($validated['subject']);
                });
                $sentCount++;
            } catch (\Throwable $e) {
                Log::warning("Failed to send admin message to agent #{$agent->id}: " . $e->getMessage());
                $failedNames[] = $agent->name;
            }
        }
    
        AdminAuditLog::record('agent', 'message_agents', [
            'agent_ids'   => $validated['agent_ids'],
            'subject'     => $validated['subject'],
            'sent_count'  => $sentCount,
            'failed'      => $failedNames,
        ]);
    
        if ($sentCount === 0) {
            return back()->withErrors(['message' => 'Could not send to any of the selected agents.']);
        }
    
        $note = count($failedNames)
            ? "Message sent to {$sentCount} agent(s). Failed for: " . implode(', ', $failedNames) . '.'
            : "Message sent to {$sentCount} agent(s).";
    
        return back()->with('success', $note);
    }

    public function verification() {
        return Inertia::render('SuperAdmin/Agents/VerificationPage', [
            'verifications' => AgentVerification::orderBy('submitted_at', 'desc')->get(),
        ]);
    }

    public function approve(AgentVerification $verification)
    {
        $verification->update([
            'status' => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => auth()->user()->name,
        ]);
    
        $verification->agent()->update([
            'status' => 'verified',
        ]);
    
        Mail::raw(
            "Hi {$verification->agent_name},\n\n" .
            "Good news — your RentTrustGH agent verification has been approved. " .
            "Your account is now marked as verified and your listings will show the verified badge.\n\n" .
            "RentTrustGH",
            function ($message) use ($verification) {
                $message->to($verification->email)
                    ->subject('You\'re verified on RentTrustGH');
            }
        );
    
        $this->logAudit('Approved agent verification', 'agent_verification', $verification, null);
    
        return back();
    }

    public function reject(Request $request, AgentVerification $verification)
    {
        $request->validate(['admin_notes' => 'required|string']);

        $verification->update([
            'status' => 'rejected',
            'notes' => $request->notes,
            'admin_notes' => $request->admin_notes ?? null,
            'reviewed_at' => now(),
            'reviewed_by' => auth()->user()->name,
        ]);

        Mail::raw(
            "Hi {$verification->agent_name},\n\n" .
            "We reviewed your verification submission and weren't able to approve it this time.\n\n" .
            "Reason: {$request->admin_notes}\n\n" .
            "You can update your documents and resubmit from your account settings.\n\n" .
            "RentTrustGH",
            function ($message) use ($verification) {
                $message->to($verification->email)
                    ->subject('Update on your RentTrustGH verification');
            }
        );

        $this->logAudit('Rejected agent verification', 'agent_verification', $verification, $request->notes);

        return back();
    }

    private function logAudit(string $action, string $type, AgentVerification $verification, ?string $notes = null): void
    {
        AdminAuditLog::create([
            'causer_id'      => auth()->id(),
            'causer_name'    => auth()->user()->name,
            'causer_email'   => auth()->user()->email,
            'action'         => $action,
            'type'           => $type,
            'affected_user'  => $verification->agent_name,
            'affected_id'    => $verification->agent_id,
            'notes'          => $notes,
            'ip_address'     => request()->ip(),
            'properties'     => [
                'verification_id' => $verification->id,
                'email'            => $verification->email,
            ],
        ]);
    }
 
    // ─── Private helpers ──────────────────────────────────────────────────────
 
    private function formatAgent(User $agent): array
    {
        return [
            'id'             => $agent->id,
            'name'           => $agent->name           ?? $agent->full_name,
            'email'          => $agent->email,
            'phone'          => $agent->phone          ?? $agent->phone_number,
            'company'        => $agent->company,
            'type'          => $agent->type,
            'location'       => $agent->location       ?? $agent->city    ?? $agent->area,
            'bio'            => $agent->bio             ?? $agent->about,
            'status'         => $agent->status         ?? 'pending',
            'listings_count' => $agent->listings_count ?? 0,
            'active_listings'=> $agent->active_listings ?? 0,
            'sold_count'     => $agent->sold_count      ?? $agent->properties_sold ?? 0,
            'rating' => $agent->rating ? round($agent->rating, 1) : 0.0,
            'reviews_count' => $agent->reviews_count ?? 0,
            'total_revenue'  => $agent->total_revenue   ?? null,
            'avatar'         => $agent->avatar
                ? (str_starts_with($agent->avatar, 'http') ? $agent->avatar : (str_starts_with($agent->avatar, 'storage/') ? asset($agent->avatar) : asset('storage/' . ltrim($agent->avatar, '/'))))
                : null,
            'joined_at'      => $agent->created_at?->toISOString(),
            'last_active'    => $agent->last_active?->toISOString(),
            'updated_at'     => $agent->updated_at?->toISOString(),
        ];
    }
 
    private function formatListingPreview(Rental $listing): array
    {
        $raw = $listing->images ?? [];
        if (is_string($raw)) {
            $decoded = json_decode($raw, true);
            $raw     = is_array($decoded) ? $decoded : [];
        }

        if (!is_array($raw)) {
            $raw = [$raw];
        }

        $images = [];
        foreach ($raw as $item) {
            $path = null;
            if (is_string($item)) {
                $path = trim($item);
            } elseif (is_array($item)) {
                $path = trim($item['path'] ?? $item['url'] ?? '');
            }

            if (!$path) {
                continue;
            }

            if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                $images[] = $path;
                continue;
            }

            if (str_starts_with($path, '/storage/')) {
                $images[] = $path;
                continue;
            }

            if (str_starts_with($path, 'storage/')) {
                $images[] = Storage::disk('public')->url(ltrim($path, '/'));
                continue;
            }

            if (str_contains($path, '/')) {
                $images[] = Storage::disk('public')->url($path);
                continue;
            }

            $images[] = Storage::disk('public')->url("rental_images/{$path}");
        }

        return [
            'id'         => $listing->id,
            'title'      => $listing->title,
            'status'     => $listing->status,
            'location'   => $listing->area ?? $listing->city,
            'purpose'    => $listing->purpose,
            'sale_price' => $listing->sale_price,
            'rent_min'   => $listing->rent_min,
            'currency'   => 'GH₵',
            'images'     => array_values(array_filter($images)),
        ];
    }
}
