<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SaleSearchController extends Controller
{
    /**
     * Display sale listings
     */
    public function index(Request $request)
    {
        // Base query for sale listings
        $query = Rental::where('purpose', 'sale')
            ->where('status', 'approved')
            ->where('is_sold', false);

        // apply optional filters from query string
        if ($request->filled('city')) {
            $query->where('city', 'like', $request->query('city'));
        }
        if ($request->filled('area')) {
            // area may be hyphenated in URL
            $area = str_replace('-', ' ', $request->query('area'));
            $query->where('area', 'like', $area);
        }

        // Initial load: show 8 sale listings
        $listings = $query->latest()->paginate(8);

        return inertia('SaleListingsPage', [
            'listings' => $listings,
            'filters' => $request->only(['city','area']),
            'page_title' => 'Properties for Sale',
            'page_description' => 'Find the perfect property to buy'
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
                ->where('status', 'approved')
                ->where('is_sold', false)
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
     * Get sale areas
     */
    public function areas()
    {
        $areas = Rental::where('purpose', 'sale')
            ->where('status', 'approved')
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
    }

    /**
     * Show individual sale listing
     */
    public function show(Request $request, Rental $rental)
    {
        // Verify it's a sale listing and not sold
        if (!$rental->isSale() || $rental->status !== 'approved' || $rental->is_sold) {
            abort(404, 'Property not found');
        }

        // Track view
        $this->trackView($request, $rental);

        $rental->load('user');
        
        $reviews = $rental->reviews()
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('SaleDetailsPage', [
            'rental' => $rental,
            'reviews' => $reviews,
            'price_label' => 'Sale Price',
            'days_on_market' => $rental->getDaysOnMarket(),
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
            Log::warning('Failed to track sale view: ' . $e->getMessage());
        }
    }
}
