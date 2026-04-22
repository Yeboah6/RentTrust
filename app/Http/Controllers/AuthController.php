<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Subscription;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function signUp(Request $request) {
        $referrer = $request->headers->get('referer') ?? '/';
        $request->session()->put('signup_referrer', $referrer);
        
        // pass flag to show signup form by default
        return inertia('Auth/AuthPage', ['isLogin' => false]);
    }

    public function store(Request $request) {

        $signUpData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|max:15|unique:users,phone',
            'password' => 'required|string|min:8|max:255'
        ]);

        $signUpData['password'] = Hash::make($signUpData['password']);
        $signUpData['user_id'] = User::generateUUID();

        $tenant = User::create($signUpData);

        Auth::login($tenant);
        
        $tenant->update(['last_active' => now()]);
        
        // Get the referrer URL from session, default to home page
        $redirectUrl = $request->session()->pull('signup_referrer', '/');
        
        return redirect($redirectUrl);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string|min:8',
        ]);
    
        $user = User::where('email', $validated['email'])->first();
    
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ])->onlyInput('email');
        }

        // ── Suspension check ──────────────────────────────────────────────────────
        if ($user->status === 'suspended') {
            return back()->withErrors([
                'email' => 'Your account has been suspended. Please contact support for assistance.',
            ])->onlyInput('email');
        }
    
        $request->session()->regenerate();
        Auth::login($user);
        
        $user->update(['last_active' => now()]);
    
        // ── Tenant ────────────────────────────────────────────────────────────────
        if ($user->role === 'tenant') {
            $redirectUrl = $request->session()->pull('signup_referrer', '/');
            return redirect($redirectUrl);
        }
    
        // ── Agent ─────────────────────────────────────────────────────────────────
        if ($user->role === 'agent') {
            $subscription = Subscription::where('user_id', $user->id)
                ->whereIn('status', ['active', 'cancelled', 'grace'])
                ->orderByDesc('ends_at')
                ->first();
    
            $hasActiveAccess = $subscription
                && $subscription->ends_at
                && now()->lessThanOrEqualTo($subscription->ends_at);
    
            if ($hasActiveAccess && in_array($user->package, ['pro', 'elite'])) {
                // Paid period is still valid — send to the full agent dashboard
                return redirect()->intended('/agent-dashboard');
            }
    
            // Free plan, expired subscription, or no subscription at all
            // if($user->)
            return redirect()->intended('/agent/dashboard');
        }
    
        // ── Admin ─────────────────────────────────────────────────────────────────
        if ($user->role === 'admin' && $user->package === 'admin') {
            return redirect('/admin');
        }
    
        // ── Super admin ───────────────────────────────────────────────────────────
        if ($user->role === 'super_admin' && $user->package === 'super_admin') {
            return redirect('/super-admin/dashboard');
        }
    
        return redirect('/');
    }


    public function logout(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/sign-up');
    }

    public function settings() {
        return inertia('Auth/SettingsPage');
    }

    public function updateAgentProfile(Request $request) {
        $validated = $request->validate([
            'name'=>'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone'=>'nullable|string|max:15',
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

    public function updateAdminProfile(Request $request) {
        $validated = $request->validate([
            'name'=>'nullable|string|max:255',
            'email' => 'nullable|email',
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
