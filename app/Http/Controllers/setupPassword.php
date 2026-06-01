<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\{Auth, Hash};
use App\Models\User;

class setupPassword extends Controller
{

    private function findAdmin(string $token): ?User
    {
        return User::where('setup_token', hash('sha256', $token))
            ->where('setup_token_expires_at', '>', now())
            ->first();
    }

    public function show(string $token)
    {
        $admin = $this->findAdmin($token);

        if (!$admin) {
            return inertia('Auth/SetupExpired'); // or redirect with error
        }

        return inertia('Auth/AdminSetupPassword', [
            'token' => $token,
            'name'  => $admin->name,
            'email' => $admin->email,
        ]);
    }

    public function store(Request $request, string $token)
    {
        $admin = $this->findAdmin($token);

        if (!$admin) {
            return back()->withErrors(['token' => 'This setup link has expired or already been used.']);
        }

        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $admin->update([
            'password' =>Hash::make($validated['password']),
            'status' =>'verified',
            'setup_token' =>null,  // invalidate immediately — single use
            'setup_token_expires_at' => null,
        ]);

        Auth::login($admin);

        return redirect('/admin')->with('success', 'Welcome! Your account is now active.');
    }
}
