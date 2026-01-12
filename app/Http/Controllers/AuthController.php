<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function signUp() {
        return inertia('Auth/AuthPage');
    }

    public function store(Request $request) {
        sleep(2);

        $signUpData = $request->validate([
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        Tenant::create($signUpData);
        return redirect('/')->with('success', 'Account created successfully!');
        // dd($request);
    }
}
