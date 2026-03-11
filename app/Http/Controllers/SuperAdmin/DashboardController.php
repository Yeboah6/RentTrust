<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rental;
use App\Models\User;
use App\Models\ListingInquiry;

class DashboardController extends Controller
{
    public function __construct()
    {
        // super admin should be authenticated, verified and have the proper role
        $this->middleware(['auth', 'verified', 'role:super_admin']);
    }

    public function index()
    {
        // basic platform metrics
        $totalListings   = Rental::count();
        $rentalListings  = Rental::where('purpose', 'rent')->count();
        $saleListings    = Rental::where('purpose', 'sale')->count();
        $totalAgents     = User::where('role', 'agent')->count();
        $totalAdmins     = User::where('role', 'admin')->count();
        $totalUsers      = User::where('role', 'tenant')->count();
        $totalInquiries  = ListingInquiry::count();

        // SaaS metrics - reuse existing models
        $activeSubs      = User::whereHas('subscription', function ($q) {
            $q->where('status', 'active');
        })->count();
        $mrr = \App\Models\Payment::where('status', 'success')->sum('amount');
        // other metrics could be calculated as needed

        return inertia('SuperAdmin/Dashboard', [
            'platform' => [
                'total_listings'  => $totalListings,
                'rental_listings' => $rentalListings,
                'sale_listings'   => $saleListings,
                'total_agents'    => $totalAgents,
                'total_admins'    => $totalAdmins,
                'total_users'     => $totalUsers,
                'total_inquiries' => $totalInquiries,
            ],
            'saas' => [
                'active_subscriptions' => $activeSubs,
                'mrr'                  => $mrr,
            ],
        ]);
    }
}
