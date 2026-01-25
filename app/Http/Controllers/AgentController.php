<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Agent;
use App\Models\Rental;
use App\Models\RentalImage;
use Illuminate\Support\Facades\DB;

class AgentController extends Controller
{
    public function becomeAgent() {
        return inertia('BecomeAgentPage');
    }

    public function agent() {
        $agents = Agent::all();
        // $listingCounts = Rental::select('agent_id', \DB::raw('count(*) as total'))
        //     ->groupBy('agent_id')
        //     ->pluck('total', 'agent_id')
        //     ->toArray();
        return inertia('AgentsPage', ['agent' => $agents]);
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
            'password' => 'required|string|min:8|max:255',
            'status' => "nullable"
        ]);

        // Hash the password before storing
        $validated['password'] = Hash::make($validated['password']);
        $validated['status'] = "unverified";

        $agent = Agent::create($validated);

        Auth::guard('agent')->login($agent);

        return redirect('/agent-dashboard')->with('success', 'Agent account created successfully!');
    }

}
