<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log, Storage;
use Illuminate\Support\Str;
use App\Services\Seo\SeoService;

class RentalSearchController extends Controller
{
    /**
     * Display rental listings
     */
    public function listings()
    {
        $listings = Rental::where('purpose', 'rent')
            ->orderByRaw("
                CASE status
                    WHEN 'available' THEN 0
                    WHEN 'rented' THEN 1
                    WHEN 'inactive' THEN 2
                    WHEN 'sold' THEN 3
                    ELSE 4
                END
            ")
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
            ->orderByRaw("
                CASE status
                    WHEN 'available' THEN 0
                    WHEN 'rented' THEN 1
                    WHEN 'inactive' THEN 2
                    WHEN 'sold' THEN 3
                    ELSE 4
                END
            ")
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
     * Get rental cities
     */
    public function cities()
    {
        try {
            $cities = Rental::where('purpose', 'rent')
                ->whereNotNull('city')
                ->where('city', '<>', '')
                ->distinct()
                ->orderBy('city')
                ->pluck('city');

            return response()->json([
                'cities' => $cities,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch rental cities', [
                'error' => $e->getMessage(),
            ]);

            return response()->json(['cities' => []], 500);
        }
    }

    /**
     * Get rental areas
     */
    public function getAreas()
    {
        try {
            $areas = Rental::where('purpose', 'rent')
                ->whereNotNull('area')
                ->where('area', '<>', '')
                ->distinct()
                ->orderBy('area')
                ->pluck('area');

            return response()->json([
                'areas' => $areas,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch rental areas', [
                'error' => $e->getMessage(),
            ]);

            return response()->json(['areas' => []], 500);
        }
    }

    public function areas()
    {
        try {
            $areas = Rental::where('purpose', 'rent')
                ->select('city', 'area', 'rent_min', 'rent_max', 'created_at')
                ->get()
                ->groupBy('city')
                ->map(function ($cityAreas, $cityName) {
                    return $cityAreas->groupBy('area')->map(function ($areaRentals) {
                        $avgRent = $areaRentals->avg(function ($rental) {
                            return ($rental->rent_min + $rental->rent_max) / 2;
                        });
    
                        return [
                            'name'         => $areaRentals->first()->area,
                            'listingCount' => $areaRentals->count(),
                            'avgRent'      => round($avgRent),
                            'minRent'      => $areaRentals->min('rent_min'),
                            'maxRent'      => $areaRentals->max('rent_max'),
                            'trend'        => $this->calculateTrend($areaRentals),
                        ];
                    });
                });
    
            return inertia('AreasPage', ['areas' => $areas]);
    
        } catch (\Exception $e) {
            Log::error('Failed to fetch rental areas', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
    
            return response()->json([
                'error'   => 'Failed to fetch rental areas',
                'message' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    public function getAreasByCity($city)
    {
        $cityName = str_replace('-', ' ', $city);

        $areas = Rental::select('area', 'rent_min', 'rent_max', 'created_at')
            ->where('city', 'like', $cityName)
            ->get()
            ->groupBy('area')
            ->map(function ($areaRentals) {
                $avgRent = $areaRentals->avg(function ($rental) {
                    return ($rental->rent_min + $rental->rent_max) / 2;
                });

                return [
                    'name' => $areaRentals->first()->area,
                    'listingCount' => $areaRentals->count(),
                    'avgRent' => round($avgRent),
                    'minRent' => $areaRentals->min('rent_min'),
                    'maxRent' => $areaRentals->max('rent_max'),
                    'trend' => $this->calculateTrend($areaRentals),
                ];
            })
            ->values();

        return response()->json($areas);
    }

    private function calculateTrend($areaRentals)
    {
        if ($areaRentals->count() < 2) {
            return '+0%';
        }

        $thirtyDaysAgo = now()->subDays(30);

        $recentRentals = $areaRentals->filter(function ($rental) use ($thirtyDaysAgo) {
            return $rental->created_at >= $thirtyDaysAgo;
        });

        $olderRentals = $areaRentals->filter(function ($rental) use ($thirtyDaysAgo) {
            return $rental->created_at < $thirtyDaysAgo;
        });

        if ($recentRentals->isEmpty() || $olderRentals->isEmpty()) {
            return '+0%';
        }

        $recentAvg = $recentRentals->avg(function ($rental) {
            return ($rental->rent_min + $rental->rent_max) / 2;
        });

        $olderAvg = $olderRentals->avg(function ($rental) {
            return ($rental->rent_min + $rental->rent_max) / 2;
        });

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

    public function showArea($city, $area)
    {
        // Decode the area name from URL (replace hyphens with spaces)
        $areaName = str_replace('-', ' ', $area);
        $cityName = str_replace('-', ' ', $city);

        // Get all rentals for this specific area
        $properties = Rental::where('purpose', 'rent')
            ->where('city', 'like', $cityName)
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
            'seo' => app(SeoService::class)->areaMeta(Str::slug($areaName), 'rent'),
        ]);
    }

    public function showProperty(string $areaSlug, string $propertySlug)
    {
        $areaName = str_replace('-', ' ', $areaSlug);
    
        $rental = Rental::where('purpose', 'rent')
            ->where('slug', $propertySlug)
            ->where(function ($query) use ($areaName) {
                $query->whereRaw('LOWER(area) = ?', [strtolower($areaName)])
                      ->orWhereRaw('LOWER(area) LIKE ?', ['%' . strtolower($areaName) . '%']);
            })
            ->select(
                'id', 'rental_id', 'title', 'property_type', 'purpose',
                'city', 'area', 'address', 'rent_min', 'rent_max', 'sale_price',
                'status', 'is_verified', 'images', 'created_at', 'updated_at',
                'bedrooms', 'bathrooms', 'description', 'amenities',
                'advance_duration', 'agent_id', 'user_id', 'agent_name', 'agent_phone', 'agent_email'
            )
            ->firstOrFail();
    
        // Collect both IDs
        $userIds = collect([$rental->agent_id, $rental->user_id])->filter()->unique();
        
        // Get all users in one query
        $users = User::whereIn('id', $userIds)
            ->select('id', 'name', 'email', 'phone', 'company', 'bio', 'status', 'fee', 'role')
            ->get()
            ->keyBy('id');
    
        // Determine which user to show as agent (priority: agent_id > user_id)
        $agent = $users->get($rental->agent_id) ?? $users->get($rental->user_id);
    
        $reviews = $rental->reviews()->orderBy('created_at', 'desc')->get();
    
        return inertia('PropertyDetailsPage', [
            'rental' => $rental,
            'agent' => $agent,
            'reviews' => $reviews,
            'seo' => app(SeoService::class)->propertyMeta($rental),
        ]);
    }

    public function showAreaBySlug(Request $request, string $areaSlug)
    {
        $areaName = str_replace('-', ' ', $areaSlug);

        $properties = Rental::where('purpose', 'rent')
            ->where('status', 'approved')
            // ->where('is_sold', false)
            ->where(function ($query) use ($areaName) {
                $query->whereRaw('LOWER(area) = ?', [strtolower($areaName)])
                      ->orWhereRaw('LOWER(area) LIKE ?', ['%' . strtolower($areaName) . '%']);
            })
            ->latest()
            ->get();

        if ($properties->isEmpty()) {
            abort(404, 'Area not found');
        }

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
            'city' => $properties->first()->city,
            'properties' => $properties,
            'seo' => app(SeoService::class)->areaMeta($areaSlug, 'rent'),
        ]);
    }

    public function destroy(Rental $rental)
    {
        $user = Auth::user();
    
        $isOwner = $rental->user_id === $user->id || $rental->agent_id === $user->id;
        $isAdmin = in_array($user->role, ['admin', 'super_admin']);
    
        if (!$isOwner && !$isAdmin) {
            abort(403, 'You are not authorized to delete this listing.');
        }
    
        try {
            // Remove uploaded images from storage before the row is gone
            if (!empty($rental->images)) {
                foreach ($rental->images as $image) {
                    Storage::disk('public')->delete('rental_images/' . $image);
                }
            }
    
            $title = $rental->title;
            $rental->delete();
    
            if ($isAdmin) {
                AdminAuditLog::record('listing', 'Listing deleted', [
                    'affected_user' => $user->name,
                    'affected_id'   => $rental->id,
                    'notes'         => "Admin deleted listing \"{$title}\".",
                ]);
            }
    
            return redirect()->back()->with('success', 'Listing deleted successfully.');
    
        } catch (\Exception $e) {
            Log::error('Failed to delete listing: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete listing. Please try again.');
        }
    }

}
