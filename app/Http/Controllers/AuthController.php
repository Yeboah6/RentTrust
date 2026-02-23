<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function signUp(Request $request) {
        $referrer = $request->headers->get('referer') ?? '/';
        $request->session()->put('signup_referrer', $referrer);
        
        return inertia('Auth/AuthPage');
    }

    public function store(Request $request) {

        $signUpData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|max:255'
        ]);

        $signUpData['password'] = Hash::make($signUpData['password']);

        $tenant = User::create($signUpData);
        
        // Get the referrer URL from session, default to home page
        $redirectUrl = $request->session()->pull('signup_referrer', '/');
        
        return redirect($redirectUrl);
    }

    public function login(Request $request) 
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8'
        ]);

        $email = $validated['email'];
        $password = $validated['password'];

        // Find user by email
        $user = User::where('email', $email)->first();

        // If user doesn't exist or password doesn't match
        if (!$user || !Hash::check($password, $user->password)) {
            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ])->onlyInput('email');
        }

        // Regenerate session to prevent session fixation
        $request->session()->regenerate();

        // Log the user in
        Auth::login($user);

        // Redirect based on role
        if ($user->role === 'tenant') {
            $redirectUrl = $request->session()->pull('signup_referrer', '/');
            return redirect($redirectUrl);
        } 
        elseif ($user->role === 'agent' && $user->package === 'free') {
            return redirect()->intended('/agent/dashboard');
        } 
        elseif ($user->role === 'agent') {
            return redirect()->intended('/agent-dashboard');
        } 
        elseif ($user->role === 'admin') {
            return redirect('/super-admin');
        }

        // Fallback redirect (shouldn't normally reach here)
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
            'email' => 'nullable|email' . Auth::guard('agent')->user()->id,
            'phone'=>'nullable|string|max:15',
            'bio'=>'nullable|string|max:500',
            'company'=>'nullable|string|max:255',
            'fee'=>'nullable|numeric|min:0',
            'role'=>'nullable|string|max:255',
        ]);

        $agent = Auth::guard('agent')->user();
        
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
    
        $admin = Auth::guard('super')->user();
        
        $admin->update([
            'name' => $validated['name'] ?? $admin->name,
            'email' => $validated['email'] ?? $admin->email,
        ]);

        return redirect()->back()->with('success', 'Profile updated successfully');
    }
}
