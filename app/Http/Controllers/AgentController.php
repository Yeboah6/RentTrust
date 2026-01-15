<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Agent;

class AgentController extends Controller
{
    public function becomeAgent() {
        return inertia('BecomeAgentPage');
    }

    public function agent() {
        return inertia('AgentsPage');
    }

    public function storeBecomeAgent(Request $request) {
        $validated = $request->validate([
            'fullName' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:agents,email',
            'company' => 'nullable|string|max:255',
            'type' => 'required|string',
            'fee' => 'nullable|numeric|min:0',
            'bio' => 'nullable|string|max:1000',
            'password' => 'required|string|min:8|max:255'
        ]);

        // Hash the password before storing
        $validated['password'] = Hash::make($validated['password']);

        $agent = Agent::create($validated);

        Auth::guard('agent')->login($agent);

        return redirect('/agent-dashboard')->with('success', 'Agent account created successfully!');
    }

    public function agentDashboard() {
        $agentData = Auth::guard('agent')->user();
        return inertia('Dashboards/AgentDashboard', ['agentData' => $agentData]);
    }
}
