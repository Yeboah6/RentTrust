<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use App\Services\ListingAnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\FeatureGateService;

class AgentAnalyticsController extends Controller
{
    protected ListingAnalyticsService $analytics;
    protected FeatureGateService $gate;

    public function __construct(ListingAnalyticsService $analytics, FeatureGateService $gate)
    {
        $this->analytics = $analytics;
        $this->gate = $gate;
    }

    /**
     * Return analytics summary for a single listing.
     */
    public function summary(Rental $rent)
    {
        // ensure the user has analytics permission
        $user = Auth::user();
        if (! $user || ! $this->gate->canViewAnalytics($user)) {
            abort(403);
        }

        // optionally ensure the authenticated user owns this listing or has permission
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

        if (! $this->gate->canViewAnalytics($user)) {
            abort(403);
        }

        $rentals = $user->rentals()->get();
        $payload = $rentals->map(function (Rental $rent) {
            return $this->analytics->getListingAnalyticsSummary($rent);
        });

        return response()->json($payload);
    }
}
