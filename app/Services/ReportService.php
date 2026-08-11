<?php

namespace App\Services;

use App\Models\Rental;
use App\Models\User;
use App\Models\ListingInquiry;
use App\Models\ListingView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Cache, DB};

class ReportService
{
    /**
     * Get complete dashboard data with all metrics
     */
    public function getDashboardData(Request $request)
    {
        $startDate = $request->input('start_date') 
            ? \Carbon\Carbon::parse($request->input('start_date')) 
            : now()->subDays(30);
        
        $endDate = $request->input('end_date') 
            ? \Carbon\Carbon::parse($request->input('end_date')) 
            : now();

        return [
            'overview' => $this->getOverviewStats($startDate, $endDate),
            'listing_performance' => $this->getListingPerformance($startDate, $endDate),
            'agent_performance' => $this->getAgentPerformance($startDate, $endDate),
            'plan_distribution' => $this->getPlanDistribution(),
            'rent_vs_sale' => $this->getRentVsSaleStats($startDate, $endDate),
            'agent_vs_listing' => $this->getAgentVsListingStats($startDate, $endDate),
            'location_insights' => $this->getLocationInsights($startDate, $endDate),
            'date_range' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
        ];
    }

    /**
     * Get overview statistics
     */
    public function getOverviewStats($startDate, $endDate)
    {
        $cacheKey = "admin_report_overview_{$startDate->format('Y-m-d')}_{$endDate->format('Y-m-d')}";
        
        return Cache::remember($cacheKey, 60, function () use ($startDate, $endDate) {
            return [
                'total_listings' => Rental::count(),
                'active_rentals' => Rental::where('purpose', 'rent')
                    ->where('status', 'active')
                    ->where('is_sold', false)
                    ->count(),
                'active_sales' => Rental::where('purpose', 'sale')
                    ->where('status', 'active')
                    ->where('is_sold', false)
                    ->count(),
                'total_agents' => User::where('role', 'agent')->count(),
                'new_listings_7d' => Rental::where('created_at', '>=', now()->subDays(7))->count(),
                'total_inquiries' => ListingInquiry::count(),
                'total_views' => ListingView::where('created_at', '>=', $startDate)
                    ->where('created_at', '<=', $endDate)
                    ->count(),
                'total_verifications' => User::where('status', 'verified')->count(),
            ];
        });
    }

    /**
     * Get listing performance metrics
     */
    public function getListingPerformance($startDate, $endDate)
    {
        return [
            'most_viewed' => Rental::where('rentals.created_at', '>=', $startDate)
                ->where('rentals.created_at', '<=', $endDate)
                ->select('rentals.id', 'rentals.title', 'rentals.purpose', 'rentals.area', 'rentals.created_at')
                ->selectRaw('COUNT(listing_views.id) as views')
                ->leftJoin('listing_views', 'rentals.id', '=', 'listing_views.rental_id')
                ->groupBy('rentals.id', 'rentals.title', 'rentals.purpose', 'rentals.area', 'rentals.created_at')
                ->orderByDesc('views')
                ->limit(10)
                ->get(),

            'most_inquiries' => Rental::whereBetween('rentals.created_at', [$startDate, $endDate])
                ->leftJoin('listing_inquiries', 'rentals.id', '=', 'listing_inquiries.rental_id')
                ->select(
                    'rentals.id',
                    'rentals.title', 
                    'rentals.purpose', 
                    'rentals.area', 
                    'rentals.created_at',
                    DB::raw('COUNT(listing_inquiries.id) as inquiries_count')
                )
                ->groupBy('rentals.id',
                    'rentals.title', 
                    'rentals.purpose', 
                    'rentals.area', 
                    'rentals.created_at'
                )
                ->orderByDesc('inquiries_count')
                ->limit(10)
                ->get(),

            'zero_engagement' => Rental::leftJoin('listing_views', 'rentals.id', '=', 'listing_views.rental_id')
                ->whereDoesntHave('inquiries')
                ->where('rentals.created_at', '>=', $startDate)
                ->where('rentals.created_at', '<=', $endDate)
                ->whereNull('listing_views.id')
                ->limit(20)
                ->select('rentals.id', 'rentals.title', 'rentals.purpose', 'rentals.area', 'rentals.created_at')
                ->distinct()
                ->get(),

            'avg_days_on_market' => collect(Rental::where('purpose', 'sale')
                ->where('is_sold', false)
                ->where('created_at', '>=', $startDate)
                ->where('created_at', '<=', $endDate)
                ->select('created_at')
                ->get()
            )->avg(fn($rental) => now()->diffInDays($rental->created_at)) ?? 0,
        ];
    }

    /**
     * Get agent performance metrics
     */
    public function getAgentPerformance($startDate, $endDate)
    {
        return [
            'top_agents_by_listings' => User::where('role', ['agent', 'landlord'])
                ->leftJoin('rentals', function ($join) {
                    $join->on('users.id', '=', 'rentals.agent_id')
                         ->orOn('users.id', '=', 'rentals.user_id');
                })
                ->select(
                    'users.id', 
                    'users.user_id', 
                    'users.name', 
                    'users.email', 
                    'users.company', 
                    'users.status',
                    DB::raw('COUNT(rentals.id) as rentals_count')
                    )
                ->groupBy(
                    'users.id', 
                    'users.user_id', 
                    'users.name', 
                    'users.email', 
                    'users.company', 
                    'users.status',
                )
                ->orderByDesc('rentals_count')
                ->limit(10)
                ->get(),

            'top_agents_by_views' => User::where('role', ['agent', 'landlord'])
                ->join('rentals', 'users.id', '=', 'rentals.user_id')
                ->join('listing_views', 'rentals.id', '=', 'listing_views.rental_id')
                ->selectRaw('users.id, users.user_id, users.name, users.email, users.company, users.status, COUNT(listing_views.id) as total_views')
                ->groupBy('users.id', 'users.user_id', 'users.name', 'users.email', 'users.company', 'users.status')
                ->orderByDesc('total_views')
                ->limit(10)
                ->get(),

            'top_agents_by_inquiries' => User::where('role', ['agent', 'landlord'])
                ->join('rentals', 'users.id', '=', 'rentals.user_id')
                ->join('listing_inquiries', 'rentals.id', '=', 'listing_inquiries.rental_id')
                ->selectRaw('users.id, users.user_id, users.name, users.email, users.company, users.status, COUNT(listing_inquiries.id) as total_inquiries')
                ->groupBy('users.id', 'users.user_id', 'users.name', 'users.email', 'users.company', 'users.status')
                ->orderByDesc('total_inquiries')
                ->limit(10)
                ->get(),
        ];
    }

    /**
     * Get plan distribution across platform
     */
    public function getPlanDistribution()
    {
        $cacheKey = 'admin_report_plan_distribution';
        
        return Cache::remember($cacheKey, 3600, function () {
            return [
                'free' => User::whereDoesntHave('subscriptions', function($q) {
                    $q->where('status', 'active')
                        ->where('ends_at', '>', now());
                })->where('role', 'agent')->count(),
                'pro' => User::where('role', 'agent')
                    ->whereHas('subscriptions', function($q) {
                        $q->where('status', 'active')
                            ->where('ends_at', '>', now())
                            ->whereHas('plan', function($p) {
                                $p->where('slug', 'pro');
                            });
                    })->count(),
                'elite' => User::where('role', 'agent')
                    ->whereHas('subscriptions', function($q) {
                        $q->where('status', 'active')
                            ->where('ends_at', '>', now())
                            ->whereHas('plan', function($p) {
                                $p->where('slug', 'elite');
                            });
                    })->count(),
            ];
        });
    }

    /**
     * Get rent vs sale analytics
     */
    public function getRentVsSaleStats($startDate, $endDate)
    {
        return [
            'rent_count' => Rental::where('purpose', 'rent')
                ->where('created_at', '>=', $startDate)
                ->where('created_at', '<=', $endDate)
                ->count(),
            
            'sale_count' => Rental::where('purpose', 'sale')
                ->where('created_at', '>=', $startDate)
                ->where('created_at', '<=', $endDate)
                ->count(),

            'rent_views' => ListingView::join('rentals', 'listing_views.rental_id', '=', 'rentals.id')
                ->where('rentals.purpose', 'rent')
                ->where('listing_views.created_at', '>=', $startDate)
                ->where('listing_views.created_at', '<=', $endDate)
                ->count(),
            
            'sale_views' => ListingView::join('rentals', 'listing_views.rental_id', '=', 'rentals.id')
                ->where('rentals.purpose', 'sale')
                ->where('listing_views.created_at', '>=', $startDate)
                ->where('listing_views.created_at', '<=', $endDate)
                ->count(),

            'rent_inquiries' => ListingInquiry::whereHas('rental', function($q) {
                return $q->where('purpose', 'rent');
            })->count(),
            
            'sale_inquiries' => ListingInquiry::whereHas('rental', function($q) {
                return $q->where('purpose', 'sale');
            })->count(),
        ];
    }

    public function getAgentVsListingStats($startDate, $endDate)
    {
        return [
            'agent_verified' => User::where('created_at', '>=', $startDate)
                ->where('created_at', '<=', $endDate)
                ->where('status', 'verified')
                ->count(),

            'listing_verified' => Rental::where('created_at', '>=', $startDate)
                ->where('created_at', '<=', $endDate)
                ->where('status', 'verified')
                ->count(),
        ];
    }

    /**
     * Get location-based insights
     */
    public function getLocationInsights($startDate, $endDate)
    {
        return [
            'top_locations_by_listings' => Rental::where('created_at', '>=', $startDate)
                ->where('created_at', '<=', $endDate)
                ->select('area')
                ->selectRaw('COUNT(*) as total')
                ->whereNotNull('area')
                ->groupBy('area')
                ->orderByDesc('total')
                ->limit(10)
                ->get(),

            'top_locations_by_demand' => Rental::where('rentals.created_at', '>=', $startDate)
                ->where('rentals.created_at', '<=', $endDate)
                ->select('rentals.area')
                ->selectRaw('COUNT(listing_views.id) as total_views')
                ->leftJoin('listing_views', 'rentals.id', '=', 'listing_views.rental_id')
                ->whereNotNull('rentals.area')
                ->groupBy('rentals.area')
                ->orderByDesc('total_views')
                ->limit(10)
                ->get(),

            'top_locations_by_inquiries' => ListingInquiry::whereHas('rental', function($q) use ($startDate, $endDate) {
                return $q->where('created_at', '>=', $startDate)
                    ->where('created_at', '<=', $endDate);
            })
                ->join('rentals', 'listing_inquiries.rental_id', '=', 'rentals.id')
                ->select('rentals.area')
                ->selectRaw('COUNT(listing_inquiries.id) as total_inquiries')
                ->whereNotNull('rentals.area')
                ->groupBy('rentals.area')
                ->orderByDesc('total_inquiries')
                ->limit(10)
                ->get(),
        ];
    }
}
