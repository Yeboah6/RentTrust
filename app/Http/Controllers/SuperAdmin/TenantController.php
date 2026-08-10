<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Mail, Log};
use App\Models\AdminAuditLog;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function index()
    {
        $tenants = User::where('role', 'tenant')
            // ->withCount(['inquiries'])
            ->latest()
            ->get()
            ->map(fn ($u) => $this->formatTenant($u));

        return Inertia::render('SuperAdmin/Tenants/Index', [
            'tenants' => $tenants,
        ]);
    }

    public function suspend(User $tenant)
    {
        if ($tenant->status === 'suspended') {
            return back()->with('error', 'Tenant is already suspended.');
        }

        $previousStatus = $tenant->status;

        $tenant->update([
            'status'          => 'suspended',
            'suspended_at'    => now(),
            'suspended_by'    => auth()->id(),
            'previous_status' => $tenant->status,
        ]);

        AdminAuditLog::record('tenant', 'Tenant suspended', [
            'affected_user' => $tenant->name,
            'affected_id'   => $tenant->id,
            'notes'         => "Tenant \"{$tenant->name}\" suspended.",
            'properties'    => ['previous_status' => $previousStatus],
        ]);

        Log::info('SuperAdmin suspended tenant', ['tenant_id' => $tenant->id, 'admin_id' => auth()->id()]);

        return back()->with('success', "{$tenant->name} has been suspended.");
    }

    public function reactivate(User $tenant)
    {
        if ($tenant->status !== 'suspended') {
            return back()->with('error', 'Tenant is not suspended.');
        }

        $restoredStatus = $tenant->previous_status ?? 'active';

        $tenant->update([
            'status'          => $restoredStatus,
            'suspended_at'    => null,
            'suspended_by'    => null,
            'previous_status' => null,
        ]);

        AdminAuditLog::record('tenant', 'Tenant reactivated', [
            'affected_user' => $tenant->name,
            'affected_id'   => $tenant->id,
            'notes'         => "Tenant \"{$tenant->name}\" reactivated to status \"{$restoredStatus}\".",
            'properties'    => ['restored_status' => $restoredStatus],
        ]);

        Log::info('SuperAdmin reactivated tenant', ['tenant_id' => $tenant->id, 'admin_id' => auth()->id()]);

        return back()->with('success', "{$tenant->name} has been reactivated.");
    }

    public function destroy(User $tenant)
    {
        $name = $tenant->name;
        $id   = $tenant->id;
    
        DB::transaction(function () use ($tenant) {
            $tenant->inquiries()->delete();
            $tenant->delete();
        });
    
        AdminAuditLog::record('tenant', 'Tenant deleted', [
            'affected_user' => $name,
            'affected_id'   => $id,
            'notes'         => "Tenant \"{$name}\" and associated inquiries permanently deleted.",
            'properties'    => [],
        ]);
    
        Log::info('SuperAdmin deleted tenant', ['tenant_name' => $name, 'admin_id' => auth()->id()]);
    
        return redirect()
            ->route('super-admin.tenants.index')
            ->with('success', "Tenant \"{$name}\" permanently deleted.");
    }

    private function formatTenant(User $user): array
    {
        return [
            'id'              => $user->id,
            'name'            => $user->name,
            'email'           => $user->email,
            'phone'           => $user->phone ?? $user->phone_number ?? null,
            'status'          => $user->status ?? 'active',
            'location'        => $user->location ?? $user->city ?? null,
            'avatar'          => $user->avatar
                ? (str_starts_with($user->avatar, 'http') ? $user->avatar : asset('storage/' . $user->avatar))
                : null,
            'inquiries_count' => $user->inquiries_count ?? 0,
            'rentals_count'   => $user->rentals_count   ?? 0,
            'saved_count'     => $user->saved_count      ?? 0,
            'joined_at'       => $user->created_at?->toISOString(),
            'last_active'     => $user->last_login_at?->toISOString() ?? null,
        ];
    }
}