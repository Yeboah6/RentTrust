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

    public function agent() {
        $users = DB::table('users')
            ->leftJoin('rentals', 'users.id', '=', 'rentals.agent_id')
            ->leftJoin('reviews', 'rentals.id', '=', 'reviews.rental_id')
            ->select(
                'users.*',
                DB::raw('count(distinct rentals.id) as listing_count'),
                DB::raw('count(distinct reviews.id) as total_reviews'),
                DB::raw('avg(json_extract(reviews.overall_rating, "$")) as average_rating')
            )
            ->groupBy('users.id')
            ->get();

        return inertia('AgentsPage', ['agent' => $users]);
    }

    public function storeBecomeAgent(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:users,email',
            'company' => 'nullable|string|max:255',
            'type' => 'required|string',
            'fee' => 'nullable|numeric|min:0',
            'bio' => 'nullable|string|max:1000',
            'password' => 'required|string|min:8|max:12',
            'status' => "nullable"
        ]);

        // Create the agent user
        $agent = User::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'company' => $validated['company'],
            'type' => $validated['type'],
            'fee' => $validated['fee'],
            'bio' => $validated['bio'],
            'password' => Hash::make($validated['password']),
            'role' => 'agent',
            'status' => 'unverified',
        ]);

        // Log the agent in automatically
        Auth::login($agent);

        return redirect('/agent-dashboard')->with('success', 'Agent account created successfully!');
    }

}
