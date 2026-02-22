<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Rental;
use App\Models\RentalImage;
use Illuminate\Support\Facades\DB;

class AgentController extends Controller
{
    public function becomeAgent() {
        return inertia('BecomeAgentPage');
    }

    public function agent()
    {
        $agents = User::where('role', 'agent')
            ->withCount('rentals')
            ->withCount('reviews')
            ->withAvg('reviews', 'overall_rating')
            ->get();

        return inertia('AgentsPage', [
            'agents' => $agents
        ]);
    }

    public function storeBecomeAgent(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:users,email',
            'company' => 'nullable|string|max:255',
            'type' => 'required|string',
            'fee' => 'nullable|numeric|min:0',
            'bio' => 'nullable|string|max:1000',
            'password' => 'required|string|min:8|max:12',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] = 'agent'; // SET ROLE HERE
        $validated['status'] = 'unverified';

        $agent = User::create($validated);

        Auth::login($agent);

        return redirect()->route('agent.plan.select')
            ->with('success', 'Agent account created successfully!');
    }

    public function selectPlan(Request $request)
    {
        $request->validate([
            'package' => 'required|string|in:free,verified,pro'
        ]);
    
        $user = Auth::user();
        $user->package = $request->package;
        $user->save();
    
        if ($request->package === 'free') {
            return redirect('/agent/dashboard');
        }
    
        return redirect()->route('checkout.page', ['plan' => $request->package]);
    }

}
