<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, Hash};
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AgentSetupController extends Controller
{
    public function show(string $token): Response|RedirectResponse
    {
        $agent = $this->resolveAgent($token);

        if (! $agent) {
            return redirect()->route('login')->withErrors([
                'email' => 'This setup link is invalid or has expired. Please contact support.',
            ]);
        }

        return Inertia::render('Auth/AgentSetup', [
            'token'      => $token,
            'agentName'  => $agent->name,
            'agentEmail' => $agent->email,
        ]);
    }

    // Agent sets password
    public function store(Request $request, string $token): RedirectResponse
    {
        $agent = $this->resolveAgent($token);

        if (! $agent) {
            return redirect()->route('login')->withErrors([
                'email' => 'This setup link is invalid or has expired. Please contact support.',
            ]);
        }

        $request->validate([
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->letters()->mixedCase()->numbers(),
            ],
        ]);

        // Activate the account
        $agent->update([
            'password'               => Hash::make($request->password),
            'status'                 => $agent->status === 'unverified' ? 'active' : $agent->status,
            'setup_token'            => null,
            'setup_token_expires_at' => null,
        ]);

        // Log them straight in
        Auth::login($agent, remember: true);
        $request->session()->regenerate();

        return redirect('/agent/dashboard')->with('success', 'Welcome to RentTrustGH! Your account is now active.');
    }

    // ── Private ───────────────────────────────────────────────────────────────

    private function resolveAgent(string $token): ?User
    {
        return User::where('role', 'agent')
            ->where('setup_token', hash('sha256', $token))
            ->where('setup_token_expires_at', '>', now())
            ->first();
    }
}