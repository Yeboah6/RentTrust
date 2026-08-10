<?php

namespace App\Http\Controllers;

// use Illuminate\Support\Facades\Password;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\AdminAuditLog;
use App\Models\Subscription;
use App\Models\User;
use App\Models\AgentVerification;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // ── Views ────────────────────────────────────────────────────────────────
 
    public function showLogin(): Response
    {
        return Inertia::render('Auth/AuthPage', ['isLogin' => true]);
    }
 
    public function showRegister(): Response
    {
        return Inertia::render('Auth/AuthPage', ['isLogin' => false]);
    }

    public function register(RegisterRequest $request): RedirectResponse
    {
        $user = User::create([
            'user_id'  => Str::uuid(),
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'password' => Hash::make($request->password),
            'role'     => 'tenant',
            'package'  => 'free',
            'status'   => 'active',
        ]);
 
        Auth::login($user, remember: true);
 
        $request->session()->regenerate();
 
        return redirect('/');
    }

     // ── Login ─────────────────────────────────────────────────────────────────
 
    public function login(LoginRequest $request): RedirectResponse
    {
        // 1. Rate-limit check + credential check (throws ValidationException on failure)
        $request->authenticate();
 
        // 2. Auth::attempt() succeeded — user is now resolved
        $user = $request->user();
 
        // 3. Suspension check (after credentials are confirmed valid)
        if ($user->status === 'suspended') {
            Auth::logout();
            
            throw ValidationException::withMessages([
                'suspended' => 'Your account has been suspended. Please contact support for assistance.',
            ]);
        }
 
        // 4. Regenerate session to prevent fixation
        $request->session()->regenerate();
 
        // 5. Stamp last active
        $user->update(['last_active' => now()]);
 
        // 6. Role-based redirect
        return $this->redirectByRole($user);
    }

    // ── Role-based redirect ───────────────────────────────────────────────────
 
    private function redirectByRole(User $user): RedirectResponse
    {
        // ── Unverified (admin invited but not yet set up) ──────────────────────
        // if ($user->status === 'unverified') {
        //     Auth::logout();

        //     throw ValidationException::withMessages([
        //         'email' => 'Your account setup is incomplete. Please check your email for the setup link.',
        //     ]);
        // }

        // ── Super admin ────────────────────────────────────────────────────────
        if ($user->role === 'super_admin' && $user->package === 'super_admin') {
            return redirect('/super-admin/dashboard');
        }

        // ── Admin ──────────────────────────────────────────────────────────────
        if ($user->role === 'admin' && $user->package === 'admin') {
            return redirect('/admin');
        }

        // ── Agent ──────────────────────────────────────────────────────────────
        if ($user->role === 'agent') {
            return $this->redirectAgent($user);
        }

        // ── Tenant (default) ───────────────────────────────────────────────────
        return redirect('/');
    }

    private function redirectAgent(User $user): RedirectResponse
    {
        $subscription = Subscription::where('user_id', $user->id)
            ->whereIn('status', ['active', 'cancelled', 'grace'])
            ->orderByDesc('ends_at')
            ->first();
 
        $hasActiveAccess = $subscription
            && $subscription->ends_at
            && now()->lessThanOrEqualTo($subscription->ends_at);
 
        // Paid period still valid AND on a premium plan → full dashboard
        if ($hasActiveAccess && in_array($user->package, ['pro', 'elite'])) {
            return redirect()->intended('/agent-dashboard');
        }
 
        // Free plan, expired, or no subscription → basic dashboard
        return redirect()->intended('/agent/dashboard');
    }

    // ── Logout ────────────────────────────────────────────────────────────────
 
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
 
        $request->session()->invalidate();
        $request->session()->regenerateToken();
 
        return redirect('/sign-up');
    }

    // ── Email availability check ──────────────────────────────────────────────
 
    public function checkEmail(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email|max:255']);
 
        $taken = User::where('email', $request->email)->exists();
 
        return response()->json(['taken' => $taken]);
    }

    public function settings()
    {
        $user = Auth::user();

        return Inertia::render('Auth/SettingsPage', [
            'userRole' => $user?->role,
            'canAccessVerification' => $user?->role === 'agent',
            'verification' => $user?->role === 'agent'
                ? AgentVerification::where('agent_id', $user->id)->first()
                : null,
        ]);
    }

    public function updateAgentProfile(Request $request) {
        $validated = $request->validate([
            'name'=>'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . Auth::id(),
            'phone'=>'nullable|string|max:15|unique:users,phone,' . Auth::id(),
            'bio'=>'nullable|string|max:500',
            'company'=>'nullable|string|max:255',
            'fee'=>'nullable|numeric|min:0',
            'location'=>'nullable|string|max:255',
        ]);

        $agent = Auth::user();
        
        $agent->update([
            'name' => $validated['name'] ?? $agent->name,
            'email' => $validated['email'] ?? $agent->email,
            'phone' => $validated['phone'] ?? $agent->phone,
            'bio' => $validated['bio'] ?? $agent->bio,
            'company' => $validated['company'] ?? $agent->company,
            'fee' => $validated['fee'] ?? $agent->fee,
            'location' => $validated['location'] ?? $agent->location,
        ]);

        return redirect()->back()->with('success', 'Profile updated successfully');
    }

    public function updateAdminProfile(Request $request) {
        $validated = $request->validate([
            'name'=>'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . Auth::id(),
        ]);

        $admin = Auth::user();

        $before = $admin->only(array_keys($validated));

        $admin->update([
            'name' => $validated['name'] ?? $admin->name,
            'email' => $validated['email'] ?? $admin->email,
        ]);

        $changed = array_diff_assoc($admin->only(array_keys($validated)), $before);

        if (! empty($changed)) {
            AdminAuditLog::record('admin_profile', "Admin updated own profile: {$admin->name}", [
                'affected_user' => $admin->name,
                'affected_id' => $admin->id,
                'notes' => 'Admin self-updated profile fields: ' . implode(', ', array_keys($changed)),
                'properties' => ['before' => $before, 'after' => $changed],
            ]);
        }

        return redirect()->back()->with('success', 'Profile updated successfully');
    }

    /**
     * Change current user's password.
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'currentPassword' => 'required|string',
            'newPassword' => 'required|string|min:8|confirmed',
        ], [
            'newPassword.confirmed' => 'The new password confirmation does not match.',
        ]);

        // Resolve the authenticated user across all guards
        $user = Auth::user();

        if (!$user) {
            return back()->withErrors(['currentPassword' => 'Unauthenticated.']);
        }

        if (!Hash::check($validated['currentPassword'], $user->password)) {
            return back()->withErrors(['currentPassword' => 'Current password is incorrect.']);
        }

        $user->password = Hash::make($validated['newPassword']);
        $user->save();

        return back()->with('success', 'Password updated successfully.');
    }
}
