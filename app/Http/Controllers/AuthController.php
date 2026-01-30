<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Tenant;
use App\Models\Agent;
use App\Models\SuperAdmin;

class AuthController extends Controller
{
    public function signUp() {
        return inertia('Auth/AuthPage');
    }

    public function store(Request $request) {

        $signUpData = $request->validate([
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|unique:tenants,email',
            'password' => 'required|string|min:8|max:255'
        ]);

        $signUpData['password'] = Hash::make($signUpData['password']);

        $tenant = Tenant::create($signUpData);
        
        Auth::guard('tenant')->login($tenant);
        // Auth::guard('agent')->login($agent);
        
        return redirect('/');
    }

    public function login(Request $request) {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8'
        ]);

        $email = $validated['email'];
        $password = $validated['password'];

        // Check Tenant table first
        $tenant = Tenant::where('email', $email)->first();
        if ($tenant && Hash::check($password, $tenant->password)) {
            Auth::guard('tenant')->login($tenant);
            $request->session()->regenerate();
            return redirect()->intended('/');
        }

        // Check Agent table
        $agent = Agent::where('email', $email)->first();
        if ($agent && Hash::check($password, $agent->password)) {
            Auth::guard('agent')->login($agent);
            $request->session()->regenerate();
            return redirect()->intended('/agent-dashboard');
        }

        // Check Admin table
        $admin = SuperAdmin::where('email', $email)->first();
        if ($admin && Hash::check($password, $admin->password)) {
            Auth::guard('super')->login($admin);
            $request->session()->regenerate();
            return redirect()->intended('/super-admin');
        }

        // No user found with matching credentials
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
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
}
