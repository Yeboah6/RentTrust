<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RentalSearchController extends Controller
{
    /**
     * Display rental listings
     */
    public function listings()
    {
        // Initial load: show 8 listings
        $listings = Rental::where('purpose', 'rent')
            ->latest()
            ->paginate(8);

        return inertia('RentalListingsPage', [
            'listings' => $listings
        ]);
    }

    /**
     * Get more rental listings (AJAX)
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
            $listings = Rental::where('purpose', 'rent')
                ->where('status', 'approved')
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
            Log::error('Failed to fetch more rental listings', [
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
     * Get rental areas
     */
    public function areas()
    {
        $areas = Rental::where('purpose', 'rent')
            ->where('status', 'approved')
            ->select('city', 'area', 'rent_min', 'rent_max', 'created_at')
            ->get()
            ->groupBy('city')
            ->map(function ($cityAreas, $cityName) {
                return $cityAreas->groupBy('area')->map(function ($areaRentals) {
                    $avgRent = $areaRentals->avg(function ($rental) {
                        return ($rental->rent_min + $rental->rent_max) / 2;
                    });

                    $minRent = $areaRentals->min('rent_min');
                    $maxRent = $areaRentals->max('rent_max');

                    return [
                        'name' => $areaRentals->first()->area,
                        'listingCount' => $areaRentals->count(),
                        'avgRent' => round($avgRent),
                        'minRent' => $minRent,
                        'maxRent' => $maxRent,
                    ];
                });
            });

        return inertia('AreasPage', ['areas' => $areas]);
    }

    public function showArea($city, $area)
    {
        // Decode the area name from URL (replace hyphens with spaces)
        $areaName = str_replace('-', ' ', $area);
        $cityName = str_replace('-', ' ', $city);

        // Get all rentals for this specific area
        $properties = Rental::where('city', 'like', $cityName)
            ->where('area', 'like', $areaName)
            ->latest()
            ->get();

        if ($properties->isEmpty()) {
            abort(404, 'Area not found');
        }

        // Calculate area statistics
        $avgRent = $properties->avg(function ($rental) {
            return ($rental->rent_min + $rental->rent_max) / 2;
        });

        $areaData = [
            'name' => $properties->first()->area,
            'listingCount' => $properties->count(),
            'avgRent' => round($avgRent),
            'minRent' => $properties->min('rent_min'),
            'maxRent' => $properties->max('rent_max'),
            'trend' => $this->calculateTrend($properties),
        ];

        return inertia('AreaDetailPage', [
            'area' => $areaData,
            'city' => $cityName,
            'properties' => $properties,
        ]);
    }

    /**
     * Show individual rental listing
     */
    public function show(Request $request, Rental $rental)
    {
        // Only block unapproved listings, allow both rent and sale
        if ($rental->status !== 'approved') {
            abort(404, 'Listing not found');
        }
    
        // Track view
        $this->trackView($request, $rental);
    
        $rental->load('user');
    
        $reviews = $rental->reviews()
            ->orderBy('created_at', 'desc')
            ->get();
    
        return inertia('RentalDetailsPage', [
            'rental'      => $rental,
            'reviews'     => $reviews,
            'price_label' => $rental->purpose === 'sale' ? 'Sale Price' : 'Annual Rent Range',
        ]);
    }

    /**
     * Track listing view
     */
    private function trackView(Request $request, Rental $rental)
    {
        try {
            $ip = $request->ip();
            if (!\App\Models\ListingView::hasViewInWindow($rental->id, $ip)) {
                \App\Models\ListingView::create([
                    'rental_id' => $rental->id,
                    'user_id' => auth()->id(),
                    'ip' => $ip,
                    'user_agent' => $request->userAgent(),
                    'referrer' => $request->headers->get('referer'),
                ]);
            }
        } catch (\Exception $e) {
            Log::warning('Failed to track rental view: ' . $e->getMessage());
        }
    }
}
