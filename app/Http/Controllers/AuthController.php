<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Tenant;
use App\Models\Agent;

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
        
        Auth::login($tenant);
        
        return redirect('/');
    }

    public function login(Request $request) {
        $loginData = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'userType' => 'required|in:tenant,agent'
        ]);

        $userType = $loginData['userType'];
        $credentials = [
            'email' => $loginData['email'],
            'password' => $loginData['password']
        ];

        if ($userType === 'tenant') {
            $user = Tenant::where('email', $credentials['email'])->first();
            if ($user && Hash::check($credentials['password'], $user->password)) {
                Auth::login($user);
                $request->session()->regenerate();
                return redirect()->intended('/');
            }
        } elseif ($userType === 'agent') {
            $user = Agent::where('email', $credentials['email'])->first();
            if ($user && Hash::check($credentials['password'], $user->password)) {
                Auth::login($user);
                $request->session()->regenerate();
                return redirect()->intended('/agent-dashboard');
            }
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }
}
