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
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // public function signUp(Request $request) {
    //     $referrer = $request->headers->get('referer') ?? '/';
    //     $request->session()->put('signup_referrer', $referrer);
        
    //     // pass flag to show signup form by default
    //     return inertia('Auth/AuthPage', ['isLogin' => false]);
    // }

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
                'email' => 'Your account has been suspended. Please contact support for assistance.',
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
        if ($user->status === 'unverified') {
            Auth::logout();

            throw ValidationException::withMessages([
                'email' => 'Your account setup is incomplete. Please check your email for the setup link.',
            ]);
        }

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

    public function settings() {
        return inertia('Auth/SettingsPage');
    }

    public function updateAgentProfile(Request $request) {
        $validated = $request->validate([
            'name'=>'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . Auth::id(),
            'phone'=>'nullable|string|max:15|unique:users,phone,' . Auth::id(),
            'bio'=>'nullable|string|max:500',
            'company'=>'nullable|string|max:255',
            'fee'=>'nullable|numeric|min:0',
            'role'=>'nullable|string|max:255',
        ]);

        $agent = Auth::user();
        
        $agent->update([
            'name' => $validated['name'] ?? $agent->name,
            'email' => $validated['email'] ?? $agent->email,
            'phone' => $validated['phone'] ?? $agent->phone,
            'bio' => $validated['bio'] ?? $agent->bio,
            'company' => $validated['company'] ?? $agent->company,
            'fee' => $validated['fee'] ?? $agent->fee,
            'type' => $validated['role'] ?? $agent->type,
        ]);

        return redirect()->back()->with('success', 'Profile updated successfully');
    }

    public function storeAgentByAdmin(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20|unique:users,phone',
            'company' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'fee' => 'nullable|numeric|min:0',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'company' => $validated['company'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'fee' => $validated['fee'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => 'agent',
            'status' => 'unverified',
            'package' => null,
            'user_id' => User::generateUUID(),
        ];

        $agent = User::create($userData);

        AdminAuditLog::record('user', 'Agent created', [
            'affected_user' => $agent->name,
            'affected_id' => $agent->id,
            'notes' => 'Admin created a new agent account.',
            'properties' => [
                'email' => $agent->email,
                'phone' => $agent->phone,
                'company' => $agent->company,
                'status' => $agent->status,
            ],
        ]);

        return redirect()->back()->with('success', 'Agent created successfully');
    }

    public function updateAgentByAdmin(Request $request, $id) {
        $validated = $request->validate([
            'name'=>'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'phone'=>'nullable|string|max:15|unique:users,phone,' . $id,
            'bio'=>'nullable|string|max:500',
            'company'=>'nullable|string|max:255',
            'fee'=>'nullable|numeric|min:0',
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
        ]);

        AdminAuditLog::record('user', 'Agent updated', [
            'affected_user' => $agent->name,
            'affected_id' => $agent->id,
            'notes' => 'Admin updated agent details.',
            'properties' => $request->only(['name', 'email', 'phone', 'company', 'bio', 'fee']),
        ]);

        return redirect()->back()->with('success', 'Agent updated successfully');
    }

    public function updateAdminProfile(Request $request) {
        $validated = $request->validate([
            'name'=>'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . Auth::id(),
        ]);
    
        $admin = Auth::user();
        
        $admin->update([
            'name' => $validated['name'] ?? $admin->name,
            'email' => $validated['email'] ?? $admin->email,
        ]);

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
