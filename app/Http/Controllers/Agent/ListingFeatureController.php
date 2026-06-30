<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\Rental;
use App\Services\FeaturedListingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ListingFeatureController extends Controller
{
    public function requestFeature(Request $request, Rental $listing)
    {
        if ($listing->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($listing->status !== 'approved') {
            return response()->json(['message' => 'Only approved listings can be featured.'], 422);
        }

        try {
            $service = app(FeaturedListingService::class);
            $result = $service->addToFeaturedQueue($listing, 0);

            return response()->json([
                'message' => $result['status'] === 'activated'
                    ? 'Your listing is now featured!'
                    : 'Your listing has been added to the featured queue.',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}