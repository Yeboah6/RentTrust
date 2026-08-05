<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    // ─── Show ──────────────────────────────────────────────────────────────────

    public function show()
    {
        $admin = Auth::user();

        // Recent activity from the audit log — last 20 entries by this admin
        $activity = [];
        if (class_exists(\App\Models\AdminAuditLog::class)) {
            $activity = \App\Models\AdminAuditLog::where('causer_id', $admin->id)
                ->orWhere('causer_id', $admin->id)
                ->latest()
                ->limit(20)
                ->get()
                ->map(fn ($log) => [
                    'id'          => $log->id,
                    'action'      => $log->action ?? $log->title,
                    'type'        => $log->type,
                    'notes'       => $log->notes ?? $log->description,
                    'ip'          => $log->ip ?? $log->ip_address,
                    'timestamp'   => $log->created_at?->toISOString(),
                    'created_at'  => $log->created_at?->toISOString(),
                ])
                ->toArray();
        }

        // Stats
        $totalActions = count($activity);
        $thisMonth    = collect($activity)->filter(function ($item) {
            return isset($item['created_at']) &&
                now()->startOfMonth()->lte(new \Carbon\Carbon($item['created_at']));
        })->count();

        return Inertia::render('SuperAdmin/Profile', [
            'admin'    => [
                'id'                  => $admin->id,
                'name'                => $admin->name,
                'email'               => $admin->email,
                'avatar'              => $admin->avatar
                    ? (str_starts_with($admin->avatar, 'http')
                        ? $admin->avatar
                        : asset('storage/' . $admin->avatar))
                    : null,
                'last_login_at'       => $admin->last_login_at?->toISOString()
                                      ?? $admin->last_seen_at?->toISOString(),
                'last_login_ip'       => $admin->last_login_ip,
                'updated_at' => $admin->password_updated_at?->toISOString(),
                'created_at'          => $admin->created_at?->toISOString(),
                'updated_at'          => $admin->updated_at?->toISOString(),
            ],
            'activity' => $activity,
            'stats'    => [
                'total_actions'     => $totalActions,
                'this_month'        => $thisMonth,
                'admin_count'       => \App\Models\User::where('role', 'admin')->count(),
                'listings_reviewed' => 0, // extend if you track this
            ],
        ]);
    }

    // ─── Update profile ────────────────────────────────────────────────────────

    public function update(Request $request)
    {
        $admin = Auth::user();

        $validated = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', \Illuminate\Validation\Rule::unique('users', 'email')->ignore($admin->id)],
        ]);

        $admin->update($validated);

        Log::info('SuperAdmin updated their profile', ['admin_id' => $admin->id]);

        return back()->with('success', 'Profile updated successfully.');
    }

    // ─── Update password ───────────────────────────────────────────────────────

    public function updatePassword(Request $request)
    {
        $admin = Auth::user();

        $request->validate([
            'current_password'      => ['required', 'current_password'],
            'password'              => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ], [
            'current_password.current_password' => 'The current password is incorrect.',
            'password.min'                       => 'Password must be at least 8 characters.',
        ]);

        $admin->update([
            'password'            => Hash::make($request->password),
            'updated_at' => now(),
        ]);

        Log::info('SuperAdmin changed their password', ['admin_id' => $admin->id]);

        return back()->with('success', 'Password updated successfully.');
    }
}
