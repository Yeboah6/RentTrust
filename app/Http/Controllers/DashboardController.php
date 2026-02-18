<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Rental;
use App\Models\Review;
use App\Models\Report;
use App\Models\VerificationRequest;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function agentDashboard() {
        $agentData = Auth::user();

        $rentals = Rental::where('user_id', $agentData->id)->latest()->get();
        $rentalIds = $rentals->pluck('id');

        $reviews = Review::whereIn('rental_id', $rentalIds)->latest()->get();

        return inertia('Dashboards/AgentDashboard', ['agentData' => $agentData, 'rentals' => $rentals, 'reviews' => $reviews]);
    }

    public function superAdmin() {
        $adminData = Auth::user();
        
        $rentals = Rental::all();
        $agentData = User::where('role', 'agent')->get();
        $reports = Report::with('rental', 'rental.agent')->get();
        $reviews = Review::with('rental')->get();
        $verifications = VerificationRequest::with(['rental', 'agent'])->orderBy('created_at', 'desc')->get();
        
        return inertia('Dashboards/SuperAdmin', [
            'adminData' => $adminData,
            'rentals' => $rentals,
            'agentData' => $agentData,
            'reports' => $reports,
            'reviews' => $reviews,
            'verifications' => $verifications
            ]
        );
    }

    public function freeTier() {
        $agentData = Auth::user();
        $rentals = Rental::where('user_id', $agentData->id)->latest()->get();

        return inertia('Dashboards/FreeTierDashboard', ['agentData' => $agentData, 'rentals' => $rentals]);
    }
}
