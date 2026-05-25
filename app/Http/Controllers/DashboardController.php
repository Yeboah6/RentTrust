<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Rental;
use App\Models\Review;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Location;
use App\Models\PropertyType;
use App\Models\Amenity;
use App\Models\Report;
use App\Models\VerificationRequest;
use App\Models\ListingInquiry;
use App\Models\ListingView;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function agentDashboard() {
        $agentData = Auth::user();
 
        // Guard: must be authenticated and an agent
        if (!$agentData || $agentData->role !== 'agent') {
            abort(403, 'Unauthorized. Agent access only.');
        }

        // include view/inquiry/review counts for each rental and fetch status from DB
        $rentals = Rental::where('user_id', $agentData->id)
        ->select(
            'id', 'rental_id', 'title', 'property_type', 'purpose',
            'city', 'area', 'address', 'rent_min', 'rent_max', 'sale_price',
            'status', 'is_verified', 'is_featured', 'images', 'created_at', 'updated_at',
            'bedrooms', 'bathrooms', 'description', 'amenities',
            'verification_status', 'advance_duration', 'agent_name', 'agent_phone', 'agent_email'
        )
        ->withCount(['views', 'inquiries', 'reviews'])
        ->latest()
        ->get();
        $rentalIds = $rentals->pluck('id');
        $reviews = Review::whereIn('rental_id', $rentalIds)->latest()->get();
        
        // Fetch inquiries and views for the agent's rentals
        $inquiries = ListingInquiry::whereIn('rental_id', $rentalIds)
            ->with(['user', 'rental'])
            ->orderByDesc('created_at')
            ->get();
        
        $views = ListingView::whereIn('rental_id', $rentalIds)
            ->with(['user', 'rental'])
            ->orderByDesc('created_at')
            ->get();
        
        $plans = app(\App\Http\Controllers\CheckoutController::class)->plansForModal();
        $sub  = $agentData->subscription()->with('plan')->first();

        $locations = Location::all();
        $propertyTypes = PropertyType::all();
        $amenities = Amenity::all();
        
        // Get limit status for the agent
        $limitService = new \App\Services\ListingLimitService();
        $limitStatus = $limitService->getLimitStatus($agentData);

        return inertia('Dashboards/AgentDashboard', 
        [
            'agentData' => $agentData, 
            'rentals' => $rentals, 
            'reviews' => $reviews,
            'inquiries' => $inquiries,
            'views' => $views,
            'plans' => $plans,
            'limitStatus' => $limitStatus,
            'locations' => $locations,
            'propertyTypes' => $propertyTypes,
            'amenities' => $amenities,
            'open_plan_modal' => is_null($agentData->package)
            || session()->pull('show_plan_modal', false),

            'billing' => [
            'subscription' => $sub ? [
                'plan_name'  => $sub->plan?->name,
                'plan_slug'  => $sub->plan?->slug,
                'plan_price' => (float) ($sub->plan?->price ?? 0),
                'status'     => $sub->status,
                'starts_at'  => $sub->starts_at?->toDateString(),
                'ends_at'    => $sub->ends_at?->toDateString(),
                'days_left'  => $sub->ends_at
                    ? max(0, (int) now()->diffInDays($sub->ends_at, false))
                    : null,
                'grace'         => $sub->inGracePeriod(),
                'is_free'       => $sub->plan?->isFree() ?? true,
                'verified_badge'   => (bool) ($sub->plan?->verified_badge ?? false),
                'priority_ranking' => (bool) ($sub->plan?->priority_ranking ?? false),
                'analytics_access' => (bool) ($sub->plan?->analytics_access ?? false),
                'listing_limit'    => $sub->plan?->listing_limit_display ?? 'Limited',
                'lead_limit'       => $sub->plan?->lead_limit ?? 0,
            ] : null,

            // Last 10 payments for history table
            'payments' => Payment::where('user_id', $agentData->id)
                ->orderByDesc('created_at')
                ->limit(10)
                ->get()
                ->map(fn ($p) => [
                    'id'         => $p->id,
                    'reference'  => $p->reference,
                    'amount'     => (float) $p->amount,
                    'currency'   => $p->currency ?? 'GHS',
                    'provider'   => $p->provider,
                    'status'     => $p->status,
                    'created_at' => $p->created_at->format('M d, Y'),
                ])
                ->toArray(),
        ],
        ]);
    }

    public function adminDashboard() {
        $adminData = Auth::user();

        // Guard: must be authenticated and an agent
        if ($adminData->status === 'suspended') {
            abort(403, 'Unauthorized. Account has been Suspended.');
        }

        $sub  = $adminData->subscription()->with('plan')->first();
        
        $rentals = Rental::all();
        // Load agents with their total listings count and active subscription
        $agentData = User::where('role', 'agent')
            ->withCount('rentals')
            ->with(['subscription' => function($q) {
                $q->where('status', 'active')->orderByDesc('ends_at');
            }])
            ->get();
        $reports = Report::with('rental', 'rental.user')->get();
        $reviews = Review::with('rental')->get();
        $verifications = VerificationRequest::with(['rental', 'agent'])->orderBy('created_at', 'desc')->get();

        $locations = Location::all();
        $propertyTypes = PropertyType::all();
        $amenities = Amenity::all();
        
        return inertia('Dashboards/AdminDashboard', [
            'adminData' => $adminData,
            'rentals' => $rentals,
            'agentData' => $agentData,
            'reports' => $reports,
            'reviews' => $reviews,
            'verifications' => $verifications,
            'locations' => $locations,
            'propertyTypes' => $propertyTypes,
            'amenities' => $amenities,
            'plans' => app(\App\Http\Controllers\CheckoutController::class)->plansForModal(),
            'open_plan_modal' => is_null($adminData->package)
                || session()->pull('show_plan_modal', false),
    
            // Billing data for BillingDashboard tab
            'billing' => [
                'subscription' => $sub ? [
                    'plan_name'  => $sub->plan?->name,
                    'plan_slug'  => $sub->plan?->slug,
                    'plan_price' => (float) ($sub->plan?->price ?? 0),
                    'status'     => $sub->status,
                    'starts_at'  => $sub->starts_at?->toDateString(),
                    'ends_at'    => $sub->ends_at?->toDateString(),
                    'days_left'  => $sub->ends_at
                        ? max(0, (int) now()->diffInDays($sub->ends_at, false))
                        : null,
                    'grace'         => $sub->inGracePeriod(),
                    'is_free'       => $sub->plan?->isFree() ?? true,
                    'verified_badge'   => (bool) ($sub->plan?->verified_badge ?? false),
                    'priority_ranking' => (bool) ($sub->plan?->priority_ranking ?? false),
                    'analytics_access' => (bool) ($sub->plan?->analytics_access ?? false),
                    'listing_limit'    => $sub->plan?->listing_limit_display ?? 'Limited',
                    'lead_limit'       => $sub->plan?->lead_limit ?? 0,
                ] : null,
    
                // Last 10 payments for history table
                'payments' => Payment::where('user_id', $adminData->id)
                    ->orderByDesc('created_at')
                    ->limit(10)
                    ->get()
                    ->map(fn ($p) => [
                        'id'         => $p->id,
                        'reference'  => $p->reference,
                        'amount'     => (float) $p->amount,
                        'currency'   => $p->currency ?? 'GHS',
                        'provider'   => $p->provider,
                        'status'     => $p->status,
                        'created_at' => $p->created_at->format('M d, Y'),
                    ])
                    ->toArray(),
            ],
            ]
        );
    }

    public function freeTier() {
        $agentData = Auth::user();

        // include counts for free tier dashboard as well
        $rentals = Rental::where('user_id', $agentData->id)
            ->withCount(['views', 'inquiries', 'reviews'])
            ->latest()
            ->get();
        $rentalIds = $rentals->pluck('id');
        $reviews = Review::whereIn('rental_id', $rentalIds)->latest()->get();
        $locations = Location::all();
        $propertyTypes = PropertyType::all();
        $amenities = Amenity::all();

        $plans = app(\App\Http\Controllers\CheckoutController::class)->plansForModal();

        return inertia('Dashboards/FreeTierDashboard', 
        [
            'agentData' => $agentData, 
            'rentals' => $rentals, 
            'reviews' => $reviews,
            'plans' => $plans,
            'locations' => $locations,
            'propertyTypes' => $propertyTypes,
            'amenities' => $amenities,
            'open_plan_modal' => is_null($agentData->package)
            || session()->pull('show_plan_modal', false),
        ]);
    }
}
