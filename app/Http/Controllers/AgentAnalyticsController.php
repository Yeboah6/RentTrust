<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use App\Services\ListingAnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AgentAnalyticsController extends Controller
{
    protected ListingAnalyticsService $analytics;

    public function __construct(ListingAnalyticsService $analytics)
    {
        $this->analytics = $analytics;
    }

    /**
     * Return analytics summary for a single listing.
     */
    public function summary(Rental $rent)
    {
        $user = Auth::user();

        if ($user->id !== $rent->user_id && ! $user->super) {
            abort(403);
        }

        return response()->json($this->analytics->getListingAnalyticsSummary($rent));
    }

    /**
     * Return summaries for all listings belonging to the authenticated agent.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        if (! $user) {
            abort(401);
        }

        $rentals = $user->rentals()->get();
        $payload = $rentals->map(function (Rental $rent) {
            return $this->analytics->getListingAnalyticsSummary($rent);
        });

        return response()->json($payload);
    }
}
