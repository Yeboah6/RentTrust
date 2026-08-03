<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rental;
use App\Models\Plan;
use App\Models\User;
use App\Models\ListingInquiry;
use App\Models\ListingView;
use App\Models\PropertyType;
use App\Models\Location;
use App\Models\Amenity;
use App\Models\Report;
use App\Models\Review;
use App\Models\AgentVerification;

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
        $totalView  = ListingView::count();
        $totalPlans = Plan::count();
        $totalPropertyType = PropertyType::count();
        $totalLocations = Location::count();
        $totalAmenities = Amenity::count();
        $totalReports = Report::count();
        $totalReviews = Review::count();
        $totalAppReviews = Review::where('review_type', 'app')->count();
        $totalRentReviews = Review::where('review_type', 'rent')->count();
        $totalVerifications = AgentVerification::all()->count();

        // SaaS metrics - reuse existing models
        $activeSubs      = User::whereHas('subscription', function ($q) {
            $q->where('status', 'active');
        })->count();
        $mrr = \App\Models\Payment::where('status', 'success')->sum('amount');

        return inertia('SuperAdmin/Dashboard', [
            'platform' => [
                'total_listings'  => $totalListings,
                'rental_listings' => $rentalListings,
                'sale_listings'   => $saleListings,
                'total_agents'    => $totalAgents,
                'total_admins'    => $totalAdmins,
                'total_users'     => $totalUsers,
                'total_inquiries' => $totalInquiries,
                'total_views' => $totalView,
                'total_plans' => $totalPlans,
                'total_property_types' => $totalPropertyType,
                'total_locations' => $totalLocations,
                'total_amenities' => $totalAmenities,
                'total_reports' => $totalReports,
                'total_reviews' => $totalReviews,
                'total_app_reviews' => $totalAppReviews,
                'total_rent_reviews' => $totalRentReviews,
                'total_verifications' => $totalVerifications,
            ],
            'saas' => [
                'active_subscriptions' => $activeSubs,
                'mrr'                  => $mrr,
            ],
        ]);
    }
}
