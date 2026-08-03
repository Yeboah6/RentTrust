<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use App\Models\ListingView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Services\Seo\SeoService;

class SaleSearchController extends Controller
{
    /**
     * Display sale listings
     */
    public function index()
    {
        // Initial load: show 8 sale listings
        $listings = Rental::where('purpose', 'sale')
            ->where('is_sold', false)
            ->latest()
            ->paginate(8);

        return inertia('SaleListingsPage', [
            'listings' => $listings,
        ]);
    }

    /**
     * Get more sale listings (AJAX)
     */
    public function getMore(Request $request)
    {
        $page = $request->query('page', 2);
        $perPage = 8;
        
        if (!is_numeric($page) || $page < 2) {
            return response()->json([
                'error' => 'Invalid page number',
                'listings' => [],
                'has_more' => false,
            ], 400);
        }

        try {
            $listings = Rental::where('purpose', 'sale')
                // ->where('is_sold', false)
                ->latest()
                ->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'listings' => $listings->items(),
                'has_more' => $listings->hasMorePages(),
                'current_page' => $listings->currentPage(),
                'total' => $listings->total(),
                'per_page' => $listings->perPage(),
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch more sale listings', [
                'error' => $e->getMessage(),
                'page' => $page,
            ]);

            return response()->json([
                'error' => 'Failed to fetch listings',
                'message' => config('app.debug') ? $e->getMessage() : 'Server error',
                'listings' => [],
                'has_more' => false,
            ], 500);
        }
    }

    /**
     * Get sale cities
     */
    public function cities()
    {
        try {
            $cities = Rental::where('purpose', 'sale')
                ->where('is_sold', false)
                ->whereNotNull('city')
                ->where('city', '<>', '')
                ->distinct()
                ->orderBy('city')
                ->pluck('city');

            return response()->json([
                'cities' => $cities,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch sale cities', [
                'error' => $e->getMessage(),
            ]);

            return response()->json(['cities' => []], 500);
        }
    }

    /**
     * Get sale areas
     */
    public function getAreas()
    {
        try {
            $areas = Rental::where('purpose', 'sale')
                ->where('is_sold', false)
                ->whereNotNull('area')
                ->where('area', '<>', '')
                ->distinct()
                ->orderBy('area')
                ->pluck('area');

            return response()->json([
                'areas' => $areas,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch sale areas', [
                'error' => $e->getMessage(),
            ]);

            return response()->json(['areas' => []], 500);
        }
    }

    /**
     * Get sale areas
     */
    public function areas()
    {
        try {
            $areas = Rental::where('purpose', 'sale')
                ->where('is_sold', false)
                ->select('city', 'area', 'sale_price', 'created_at')
                ->get()
                ->groupBy('city')
                ->map(function ($cityAreas, $cityName) {
                    return $cityAreas->groupBy('area')->map(function ($areaSales) {
                        $avgPrice = $areaSales->avg('sale_price');
                        $minPrice = $areaSales->min('sale_price');
                        $maxPrice = $areaSales->max('sale_price');

                        return [
                            'name' => $areaSales->first()->area,
                            'listingCount' => $areaSales->count(),
                            'avgPrice' => round($avgPrice),
                            'minPrice' => $minPrice,
                            'maxPrice' => $maxPrice,
                        ];
                    });
                });

            return inertia('SaleAreasPage', ['areas' => $areas]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch sale areas', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'Failed to fetch sale areas',
                'message' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    /**
     * Show specific sale area
     */
    public function showArea($city, $area)
    {
        // Decode the area name from URL (replace hyphens with spaces)
        $areaName = str_replace('-', ' ', $area);
        $cityName = str_replace('-', ' ', $city);

        // Get all sales for this specific area
        $properties = Rental::where('purpose', 'sale')
            ->where('is_sold', false)
            ->where('city', 'like', $cityName)
            ->where('area', 'like', $areaName)
            ->latest()
            ->get();

        if ($properties->isEmpty()) {
            abort(404, 'Area not found');
        }

        // Calculate area statistics
        $avgPrice = $properties->avg('sale_price');

        $areaData = [
            'name' => $properties->first()->area,
            'listingCount' => $properties->count(),
            'avgPrice' => round($avgPrice),
            'minPrice' => $properties->min('sale_price'),
            'maxPrice' => $properties->max('sale_price'),
            'trend' => $this->calculateTrend($properties),
        ];

        return inertia('SalesDetailPage', [
            'area' => $areaData,
            'city' => $cityName,
            'properties' => $properties,
            'seo' => app(SeoService::class)->areaMeta(Str::slug($properties->first()->area), 'sale'),
        ]);
    }

    public function showProperty(Request $request, string $areaSlug, string $propertySlug)
    {
        $rental = Rental::where('purpose', 'sale')
            ->where('is_sold', false)
            ->where('slug', $propertySlug)
            ->firstOrFail();
    
        try {
            $ip = $request->ip();
            if (!ListingView::hasViewInWindow($rental->id, $ip)) {
                ListingView::create([
                    'listing_view_id' => ListingView::generateUUID(),
                    'rental_id'  => $rental->id,
                    'user_id'    => Auth::id(),
                    'ip'         => $ip,
                    'user_agent' => $request->userAgent(),
                    'referrer'   => $request->headers->get('referer'),
                ]);
            }
        } catch (\Exception $e) {
            Log::warning('Failed to track listing view: ' . $e->getMessage());
        }
    
        $rental->load('user');
        $reviews = $rental->reviews()->orderBy('created_at', 'desc')->get();
    
        return inertia('SaleDetailsPage', [
            'rental' => $rental,
            'reviews' => $reviews,
            'price_label' => 'Sale Price',
            'days_on_market' => $rental->getDaysOnMarket(),
            'seo' => app(SeoService::class)->areaMeta(Str::slug($rental->area), 'sale'),
        ]);
    }

    private function calculateTrend($areaSales)
    {
        if ($areaSales->count() < 2) {
            return '+0%';
        }

        $thirtyDaysAgo = now()->subDays(30);

        $recentSales = $areaSales->filter(function ($sale) use ($thirtyDaysAgo) {
            return $sale->created_at >= $thirtyDaysAgo;
        });

        $olderSales = $areaSales->filter(function ($sale) use ($thirtyDaysAgo) {
            return $sale->created_at < $thirtyDaysAgo;
        });

        if ($recentSales->isEmpty() || $olderSales->isEmpty()) {
            return '+0%';
        }

        $recentAvg = $recentSales->avg('sale_price');
        $olderAvg = $olderSales->avg('sale_price');

        if ($olderAvg == 0) {
            return '+0%';
        }

        $percentageChange = (($recentAvg - $olderAvg) / $olderAvg) * 100;
        $percentageChange = round($percentageChange);

        if ($percentageChange > 0) {
            return "+{$percentageChange}%";
        } elseif ($percentageChange < 0) {
            return "{$percentageChange}%";
        } else {
            return '+0%';
        }
    }

    /**
     * Show individual sale listing
     */
    // public function show(Request $request, Rental $sale)
    // {

    //     try {
    //         $ip = $request->ip();
    //         if (!ListingView::hasViewInWindow($sale->id, $ip)) {
    //             ListingView::create([
    //                 'listing_view_id' => ListingView::generateUUID(),
    //                 'rental_id'  => $sale->id,
    //                 'user_id'    => Auth::id(),
    //                 'ip'         => $ip,
    //                 'user_agent' => $request->userAgent(),
    //                 'referrer'   => $request->headers->get('referer'),
    //             ]);
    //         }
    //     } catch (\Exception $e) {
    //         Log::warning('Failed to track listing view: ' . $e->getMessage());
    //     }

    //     // Track view
    //     $this->trackView($request, $sale);

    //     $sale->load('user');
        
    //     $reviews = $sale->reviews()
    //         ->orderBy('created_at', 'desc')
    //         ->get();

    //     return inertia('SaleDetailsPage', [
    //         'rental' => $sale,
    //         'reviews' => $reviews,
    //         'price_label' => 'Sale Price',
    //         'days_on_market' => $sale->getDaysOnMarket(),
    //         'seo' => app(SeoService::class)->areaMeta(Str::slug($sale->first()->area), 'sale'),
    //     ]);
    // }

    /**
     * Track listing view
     */
    private function trackView(Request $request, Rental $rental)
    {
        try {
            $ip = $request->ip();
            if (!\App\Models\ListingView::hasViewInWindow($rental->id, $ip)) {
                \App\Models\ListingView::create([
                    'listing_view_id' => ListingView::generateUUID(),
                    'rental_id' => $rental->id,
                    'user_id' => auth()->id(),
                    'ip' => $ip,
                    'user_agent' => $request->userAgent(),
                    'referrer' => $request->headers->get('referer'),
                ]);
            }
        } catch (\Exception $e) {
            Log::warning('Failed to track sale view: ' . $e->getMessage());
        }
    }
}
