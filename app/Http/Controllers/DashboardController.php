<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Agent;
use App\Models\Rental;
use App\Models\Review;
use App\Models\Report;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function agentDashboard() {
        $agentData = Auth::guard('agent')->user();

        $rentals = Rental::where('agent_id', $agentData->id)->get();
        $rentalIds = $rentals->pluck('id');

        $review = Review::whereIn('rental_id', $rentalIds)->get();
        // dd($review);

        return inertia('Dashboards/AgentDashboard', ['agentData' => $agentData, 'rentals' => $rentals, 'review' => $review]);
    }

    public function superAdmin() {
        $adminData = Auth::guard('super')->user();
        $rentals = Rental::all();
        $agentData = Agent::all();
        $reports = Report::all();
        return inertia('Dashboards/SuperAdmin', ['adminData' => $adminData, 'rentals' => $rentals, 'agentData' => $agentData, 'reports' => $reports]);
    }
}
