<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Agent;
use App\Models\Rental;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function agentDashboard() {
        $agentData = Auth::guard('agent')->user();

        $rentals = Rental::where('agent_id', $agentData->id)->get();
        // dd($rentals);

        return inertia('Dashboards/AgentDashboard', ['agentData' => $agentData, 'rentals' => $rentals]);
    }

    public function superAdmin() {
        return inertia('Dashboards/SuperAdmin');
    }
}
