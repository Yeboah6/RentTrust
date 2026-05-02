<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Rental;
use App\Models\AdminAuditLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AgentController extends Controller
{
    public function index()
    {
        $agents = User::where('role', 'agent')
            ->withCount([
                'rentals as listings_count',
                'rentals as active_listings' => fn($q) => $q->where('status', 'approved')->where('is_sold', false),
                'rentals as sold_count'      => fn($q) => $q->where('is_sold', true),
                'reviews as reviews_count',
            ])
            ->withAvg('reviews as rating', 'overall_rating')
            ->with(['subscription.plan'])   // for tier/package
            ->addSelect([
                'users.*',
                // last time any of their listings was viewed as a proxy for last_active
                // swap for sessions/login table if you track that separately
            ])
            ->get()
            ->map(function (User $user) {
                return [
                    'id'              => $user->id,
                    'name'            => $user->name,
                    'email'           => $user->email,
                    'phone'           => $user->phone,
                    'status'          => $user->status ?? 'pending',
                    'agency'          => $user->company,
                    'bio'             => $user->bio,                    // add profile photo column if needed
                    'is_verified'     => in_array($user->status, ['verified', 'active']),
                    'is_featured'     => false,                         // add featured flag to users table if needed
                    'tier'            => $user->subscription?->plan?->slug
                                         ?? $user->package
                                         ?? 'standard',             // add city/area column if needed
                    'listings_count'  => $user->listings_count  ?? 0,
                    'active_listings' => $user->active_listings ?? 0,
                    'sold_count'      => $user->sold_count      ?? 0,
                    'rating'          => $user->rating          ? round($user->rating, 1) : null,
                    'reviews_count'   => $user->reviews_count   ?? 0,       // add if you track commissions
                    'joined_at'       => $user->created_at,
                    'last_active'     => $user->last_active,
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
            'name'                  => ['required', 'string', 'max:255'],
            'email'                 => ['required', 'email', 'unique:users,email'],
            'phone'                 => ['nullable', 'string', 'max:30'],
            'agency'                => ['nullable', 'string', 'max:255'],
            'type'                  => ['nullable', 'string', 'max:100'],
            'location'              => ['nullable', 'string', 'max:255'],
            'bio'                   => ['nullable', 'string', 'max:2000'],
            'website'               => ['nullable', 'url', 'max:255'],
            'status'                => ['required', Rule::in(['active', 'pending', 'verified'])],
            'tier'                  => ['required', Rule::in(['basic', 'standard', 'pro', 'premium'])],
            'is_verified'           => ['boolean'],
            'is_featured'           => ['boolean'],
            'password'              => ['required', 'string', 'min:8', 'confirmed'],
        ]);
 
        $agent = DB::transaction(function () use ($validated) {
 
            // Create the agent record — map form field names to model column names
            $agent = User::create([
                'user_id'        => User::generateUUID(),
                'name'           => $validated['name'],
                'email'          => $validated['email'],
                'phone'          => $validated['phone']    ?? null,
                'agency_name'    => $validated['agency']   ?? null,
                'role'           => 'agent',
                'location'       => $validated['location'] ?? null,
                'bio'            => $validated['bio']      ?? null,
                'type'        => $validated['type']  ?? null,
                'status'         => $validated['status'],
                'tier'           => $validated['tier'],
                'is_verified'    => $validated['is_verified']  ?? false,
                'is_featured'    => $validated['is_featured']  ?? false,
                'password'       => Hash::make($validated['password']),
                'created_by'     => auth()->id(),
 
                // Auto-set verified_at if created as verified
                'verified_at'    => $validated['status'] === 'verified' ? now() : null,
                'verified_by'    => $validated['status'] === 'verified' ? auth()->id() : null,
            ]);
 
            // Optionally create a linked User account so the agent can log in
            // Uncomment if your platform uses a shared users table for auth:
            //
            // $user = User::create([
            //     'name'     => $validated['name'],
            //     'email'    => $validated['email'],
            //     'password' => Hash::make($validated['password']),
            //     'role'     => 'agent',
            // ]);
            // $agent->update(['user_id' => $user->id]);
 
            return $agent;
        });
 
        Log::info('SuperAdmin created agent', [
            'agent_id' => $agent->id,
            'admin_id' => auth()->id(),
        ]);
 
        return redirect()
            ->route('super-admin.agents.show', $agent)
            ->with('success', "Agent \"{$agent->name}\" created successfully.");
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
 
        // Load recent listings for the show page sidebar
        $listings = Rental::where('user_id', $agent->user_id ?? $agent->id)
            ->orWhere('agent_id', $agent->id)
            ->latest()
            ->take(10)
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
            'agency'      => ['nullable', 'string', 'max:255'],
            'license'     => ['nullable', 'string', 'max:100'],
            'location'    => ['nullable', 'string', 'max:255'],
            'bio'         => ['nullable', 'string', 'max:2000'],
            'website'     => ['nullable', 'url', 'max:255'],
            'status'      => ['required', Rule::in(['active', 'pending', 'verified', 'suspended', 'rejected', 'inactive'])],
            'tier'        => ['required', Rule::in(['basic', 'standard', 'pro', 'premium'])],
            'is_verified' => ['boolean'],
            'is_featured' => ['boolean'],
            'password'    => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);
 
        DB::transaction(function () use ($agent, $validated) {
            $fillable = collect($validated)->except(['password', 'password_confirmation'])->toArray();
 
            // Map form fields to model fields
            $fillable['company'] = $fillable['agency'] ?? null;
            unset($fillable['agency']);
 
            $fillable['license_number'] = $fillable['license'] ?? null;
            unset($fillable['license']);
 
            $agent->update($fillable);
 
            // Update password only if provided
            if (!empty($validated['password'])) {
                $agent->update(['password' => Hash::make($validated['password'])]);
 
                // Also update the linked User if the agent has one
                if ($agent->user) {
                    $agent->user->update(['password' => Hash::make($validated['password'])]);
                }
            }
        });
 
        Log::info('SuperAdmin updated agent', [
            'user_id' => $agent->id,
            'admin_id' => auth()->id(),
        ]);
 
        return redirect()
            ->route('super-admin.agents.show', $agent)
            ->with('success', 'Agent account updated successfully.');
    }

    // ─── Verify ───────────────────────────────────────────────────────────────
 
    public function verify(User $agent)
    {
        if ($agent->is_verified) {
            return back()->with('info', 'Agent is already verified.');
        }
 
        $agent->update([
            'is_verified' => true,
            'status'      => 'verified',
            'verified_at' => now(),
            'verified_by' => auth()->id(),
        ]);
 
        // Audit log
        AdminAuditLog::record('verification', "Agent verified: {$agent->name}", [
            'affected_user' => $agent->name,
            'affected_id' => $agent->id,
            'notes' => "Agent {$agent->email} has been verified",
            'properties' => ['agent_id' => $agent->id, 'verified_by' => auth()->id()],
        ]);
 
        // $agent->user?->notify(new AgentVerified($agent));
 
        Log::info('SuperAdmin verified agent', [
            'user_id' => $agent->id,
            'admin_id' => auth()->id(),
        ]);
 
        return back()->with('success', "{$agent->name} has been verified.");
    }

    // ─── Suspend ──────────────────────────────────────────────────────────────
 
    public function suspend(User $agent)
    {
        if ($agent->status === 'suspended') {
            return back()->with('error', 'Agent is already suspended.');
        }
 
        $previousStatus = $agent->status;
 
        $agent->update([
            'status'           => 'suspended',
            'suspended_at'     => now(),
            'suspended_by'     => auth()->id(),
            'previous_status'  => $previousStatus,
        ]);
 
        // Audit log
        AdminAuditLog::record('suspension', "Agent suspended: {$agent->name}", [
            'affected_user' => $agent->name,
            'affected_id' => $agent->id,
            'notes' => "Agent {$agent->email} has been suspended. Previous status: {$previousStatus}",
            'properties' => ['agent_id' => $agent->id, 'previous_status' => $previousStatus, 'suspended_by' => auth()->id()],
        ]);
 
        // Optionally hide all active listings
        Rental::where('agent_id', $agent->id)
            ->where('status', 'approved')
            ->update(['status' => 'suspended']);
 
        // $agent->user?->notify(new AgentSuspended($agent));
 
        Log::info('SuperAdmin suspended agent', [
            'user_id' => $agent->id,
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
 
        $restoreStatus = $agent->previous_status ?? ($agent->is_verified ? 'verified' : 'active');
 
        $agent->update([
            'status'          => $restoreStatus,
            'suspended_at'    => null,
            'suspended_by'    => null,
            'previous_status' => null,
        ]);
 
        // Audit log
        AdminAuditLog::record('suspension', "Agent reactivated: {$agent->name}", [
            'affected_user' => $agent->name,
            'affected_id' => $agent->id,
            'notes' => "Agent {$agent->email} has been reactivated. Restored status: {$restoreStatus}",
            'properties' => ['agent_id' => $agent->id, 'restored_status' => $restoreStatus, 'reactivated_by' => auth()->id()],
        ]);
 
        // Restore suspended listings that belonged to this agent
        Rental::where('agent_id', $agent->id)
            ->where('status', 'suspended')
            ->update(['status' => 'approved']);
 
        Log::info('SuperAdmin reactivated agent', [
            'agent_id' => $agent->id,
            'admin_id' => auth()->id(),
        ]);
 
        return back()->with('success', "{$agent->name} has been reactivated.");
    }
 
    // ─── Delete ───────────────────────────────────────────────────────────────
 
    public function destroy(User $agent)
    {
        $name = $agent->name;
 
        DB::transaction(function () use ($agent) {
            // Delete avatar from storage
            if ($agent->avatar && !str_starts_with($agent->avatar, 'http')) {
                Storage::disk('public')->delete($agent->avatar);
            }
 
            // Delete all listings and their images
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
 
            // Delete associated user account if linked
            $agent->user?->delete();
 
            $agent->delete();
        });
 
        Log::info('SuperAdmin deleted agent', [
            'agent_name' => $name,
            'admin_id'   => auth()->id(),
        ]);
 
        return redirect()
            ->route('super-admin.agents.index')
            ->with('success', "Agent \"{$name}\" and all their data have been permanently deleted.");
    }
 
    // ─── Private helpers ──────────────────────────────────────────────────────
 
    private function formatAgent(User $agent): array
    {
        return [
            'id'             => $agent->id,
            'name'           => $agent->name           ?? $agent->full_name,
            'email'          => $agent->email,
            'phone'          => $agent->phone          ?? $agent->phone_number,
            'agency'         => $agent->agency_name    ?? $agent->agency ?? $agent->company,
            'license'        => $agent->license_number ?? $agent->rea_number ?? $agent->license,
            'location'       => $agent->location       ?? $agent->city    ?? $agent->area,
            'bio'            => $agent->bio             ?? $agent->about,
            'website'        => $agent->website        ?? $agent->website_url,
            'status'         => $agent->status         ?? 'pending',
            'tier'           => $agent->tier           ?? $agent->plan    ?? $agent->subscription_type ?? 'standard',
            'is_verified'    => (bool) ($agent->is_verified ?? false),
            'is_featured'    => (bool) ($agent->is_featured ?? false),
            'listings_count' => $agent->listings_count ?? 0,
            'active_listings'=> $agent->active_listings ?? 0,
            'sold_count'     => $agent->sold_count      ?? $agent->properties_sold ?? 0,
            'rating'        => $agent->rating ? round($agent->rating, 1) : null,
            'reviews_count' => $agent->reviews_count ?? 0,
            'total_revenue'  => $agent->total_revenue   ?? null,
            'avatar'         => $agent->avatar
                ? (str_starts_with($agent->avatar, 'http') ? $agent->avatar : asset('storage/' . $agent->avatar))
                : null,
            'joined_at'      => $agent->created_at?->toISOString(),
            'last_active'    => $agent->last_active?->toISOString(),
            'updated_at'     => $agent->updated_at?->toISOString(),
        ];
    }
 
    private function formatListingPreview(Rental $listing): array
    {
        $images = $listing->images ?? [];
        $first  = is_array($images) ? ($images[0] ?? null) : null;
        if ($first && is_array($first)) $first = $first['path'] ?? $first['url'] ?? null;
        if ($first && !str_starts_with($first, 'http')) $first = asset('storage/' . ltrim($first, '/'));
 
        return [
            'id'         => $listing->id,
            'title'      => $listing->title,
            'status'     => $listing->status,
            'location'   => $listing->area ?? $listing->city,
            'purpose'    => $listing->purpose,
            'sale_price' => $listing->sale_price,
            'rent_min'   => $listing->rent_min,
            'currency'   => 'GH₵',
            'images'     => $first ? [$first] : [],
        ];
    }
}
