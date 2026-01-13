<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tenant;

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
            'password' => 'required|string|min:8',
        ]);

        Tenant::create($signUpData);
        return redirect('/');
    }
}
