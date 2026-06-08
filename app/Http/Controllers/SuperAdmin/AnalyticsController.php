<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $range  = $request->input('range', '6m');  // 7d | 30d | 3m | 6m | 12m | all
        $from   = $this->resolveFrom($range);
        $to     = Carbon::now();

        $analytics = [
            // ── Revenue ────────────────────────────────────────────────────────
            'monthly_revenue'      => $this->monthlyRevenue($from, $to),
            'provider_split'       => $this->providerSplit($from, $to),
            'status_breakdown'     => $this->statusBreakdown($from, $to),
            'total_revenue'        => $this->totalRevenue($from, $to),
            'avg_payment'          => $this->avgPayment($from, $to),

            // ── Subscriptions ─────────────────────────────────────────────────
            'subscription_summary' => $this->subscriptionSummary(),
            'monthly_new_subs'     => $this->monthlyNewSubs($from, $to),

            // ── Users ─────────────────────────────────────────────────────────
            'user_growth'          => $this->userGrowth($from, $to),
            'users_by_role'        => $this->usersByRole(),
            'users_by_package'     => $this->usersByPackage(),
            'total_users'          => DB::table('users')->count(),
            'new_users_period'     => DB::table('users')
                                        ->whereBetween('created_at', [$from, $to])
                                        ->count(),

            // ── Listings ──────────────────────────────────────────────────────
            'listing_stats'        => $this->listingStats(),
            'listings_by_type'     => $this->listingsByType(),
            'listings_by_city'     => $this->listingsByCity(),
            'listings_by_purpose'  => $this->listingsByPurpose(),
            'listing_growth'       => $this->listingGrowth($from, $to),

            // ── Engagement ────────────────────────────────────────────────────
            'total_views'          => DB::table('listing_views')
                                        ->whereBetween('created_at', [$from, $to])
                                        ->count(),
            'unique_viewers'       => DB::table('listing_views')
                                        ->whereBetween('created_at', [$from, $to])
                                        ->distinct('ip')
                                        ->count('ip'),
            'views_over_time'      => $this->viewsOverTime($from, $to),
            'top_listings'         => $this->topListings($from, $to),
            'inquiries_summary'    => $this->inquiriesSummary($from, $to),
            'inquiries_by_type'    => $this->inquiriesByType($from, $to),
            'inquiries_over_time'  => $this->inquiriesOverTime($from, $to),

            // ── Meta ──────────────────────────────────────────────────────────
            'range'    => $range,
            'from'     => $from->toDateString(),
            'to'       => $to->toDateString(),
        ];

        return Inertia::render('SuperAdmin/Analytics/Index', compact('analytics'));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function resolveFrom(string $range): Carbon
    {
        return match ($range) {
            '7d'  => Carbon::now()->subDays(7),
            '30d' => Carbon::now()->subDays(30),
            '3m'  => Carbon::now()->subMonths(3),
            '6m'  => Carbon::now()->subMonths(6),
            '12m' => Carbon::now()->subMonths(12),
            'all' => Carbon::createFromDate(2020, 1, 1),
            default => Carbon::now()->subMonths(6),
        };
    }

    // ── Revenue ───────────────────────────────────────────────────────────────

    private function monthlyRevenue(Carbon $from, Carbon $to): array
    {
        return DB::table('payments')
            ->select(
                DB::raw("strftime('%Y-%m', created_at) as month"),
                DB::raw('SUM(amount) as revenue'),
                DB::raw('COUNT(*) as transactions')
            )
            ->where('status', 'success')
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->toArray();
    }

    private function providerSplit(Carbon $from, Carbon $to): array
    {
        return DB::table('payments')
            ->select('provider', DB::raw('SUM(amount) as total'), DB::raw('COUNT(*) as count'))
            ->where('status', 'success')
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('provider')
            ->orderByDesc('total')
            ->get()
            ->toArray();
    }

    private function statusBreakdown(Carbon $from, Carbon $to): array
    {
        $rows = DB::table('payments')
            ->select('status', DB::raw('COUNT(*) as count'), DB::raw('SUM(amount) as total'))
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('status')
            ->get();

        $out = [];
        foreach ($rows as $row) {
            $out[$row->status] = ['count' => $row->count, 'total' => $row->total];
        }
        return $out;
    }

    private function totalRevenue(Carbon $from, Carbon $to): float
    {
        return (float) DB::table('payments')
            ->where('status', 'success')
            ->whereBetween('created_at', [$from, $to])
            ->sum('amount');
    }

    private function avgPayment(Carbon $from, Carbon $to): float
    {
        return (float) DB::table('payments')
            ->where('status', 'success')
            ->whereBetween('created_at', [$from, $to])
            ->avg('amount') ?? 0;
    }

    // ── Subscriptions ─────────────────────────────────────────────────────────

    private function subscriptionSummary(): array
    {
        $rows = DB::table('subscriptions')
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get();

        $out = [];
        foreach ($rows as $row) {
            $out[$row->status] = (int) $row->count;
        }
        return $out;
    }

    private function monthlyNewSubs(Carbon $from, Carbon $to): array
    {
        return DB::table('subscriptions')
            ->select(
                DB::raw("strftime('%Y-%m', created_at) as month"),
                DB::raw('COUNT(*) as count')
            )
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->toArray();
    }

    // ── Users ─────────────────────────────────────────────────────────────────

    private function userGrowth(Carbon $from, Carbon $to): array
    {
        return DB::table('users')
            ->select(
                DB::raw("strftime('%Y-%m', created_at) as month"),
                DB::raw('COUNT(*) as count')
            )
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->toArray();
    }

    private function usersByRole(): array
    {
        return DB::table('users')
            ->select('role', DB::raw('COUNT(*) as count'))
            ->groupBy('role')
            ->orderByDesc('count')
            ->get()
            ->toArray();
    }

    private function usersByPackage(): array
    {
        return DB::table('users')
            ->select('package', DB::raw('COUNT(*) as count'))
            ->groupBy('package')
            ->orderByDesc('count')
            ->get()
            ->toArray();
    }

    // ── Listings ──────────────────────────────────────────────────────────────

    private function listingStats(): array
    {
        return [
            'total'    => DB::table('rentals')->count(),
            'active'   => DB::table('rentals')->where('status', 'active')->count(),
            'pending'  => DB::table('rentals')->where('status', 'pending')->count(),
            'featured' => DB::table('rentals')->where('is_featured', true)->count(),
            'boosted'  => DB::table('rentals')->where('is_boosted', true)->count(),
            'sold'     => DB::table('rentals')->where('is_sold', true)->count(),
            'rented'   => DB::table('rentals')->where('status', 'rented')->count(),
        ];
    }

    private function listingsByType(): array
    {
        return DB::table('rentals')
            ->select('property_type', DB::raw('COUNT(*) as count'))
            ->groupBy('property_type')
            ->orderByDesc('count')
            ->limit(8)
            ->get()
            ->toArray();
    }

    private function listingsByCity(): array
    {
        return DB::table('rentals')
            ->select('city', DB::raw('COUNT(*) as count'))
            ->groupBy('city')
            ->orderByDesc('count')
            ->limit(8)
            ->get()
            ->toArray();
    }

    private function listingsByPurpose(): array
    {
        return DB::table('rentals')
            ->select('purpose', DB::raw('COUNT(*) as count'))
            ->groupBy('purpose')
            ->get()
            ->toArray();
    }

    private function listingGrowth(Carbon $from, Carbon $to): array
    {
        return DB::table('rentals')
            ->select(
                DB::raw("strftime('%Y-%m', created_at) as month"),
                DB::raw('COUNT(*) as count')
            )
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->toArray();
    }

    // ── Engagement ────────────────────────────────────────────────────────────

    private function viewsOverTime(Carbon $from, Carbon $to): array
    {
        return DB::table('listing_views')
            ->select(
                DB::raw("strftime('%Y-%m', created_at) as month"),
                DB::raw('COUNT(*) as views'),
                DB::raw('COUNT(DISTINCT ip) as unique_viewers')
            )
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->toArray();
    }

    private function topListings(Carbon $from, Carbon $to): array
    {
        return DB::table('listing_views')
            ->join('rentals', 'rentals.id', '=', 'listing_views.rental_id')
            ->select(
                'rentals.id',
                'rentals.title',
                'rentals.city',
                'rentals.property_type',
                DB::raw('COUNT(listing_views.id) as views'),
                DB::raw('COUNT(DISTINCT listing_views.ip) as unique_views')
            )
            ->whereBetween('listing_views.created_at', [$from, $to])
            ->groupBy('rentals.id', 'rentals.title', 'rentals.city', 'rentals.property_type')
            ->orderByDesc('views')
            ->limit(10)
            ->get()
            ->toArray();
    }

    private function inquiriesSummary(Carbon $from, Carbon $to): array
    {
        return [
            'total'        => DB::table('listing_inquiries')->whereBetween('created_at', [$from, $to])->count(),
            'from_users'   => DB::table('listing_inquiries')->whereBetween('created_at', [$from, $to])->whereNotNull('user_id')->count(),
            'from_guests'  => DB::table('listing_inquiries')->whereBetween('created_at', [$from, $to])->whereNull('user_id')->count(),
        ];
    }

    private function inquiriesByType(Carbon $from, Carbon $to): array
    {
        return DB::table('listing_inquiries')
            ->select('type', DB::raw('COUNT(*) as count'))
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('type')
            ->get()
            ->toArray();
    }

    private function inquiriesOverTime(Carbon $from, Carbon $to): array
    {
        return DB::table('listing_inquiries')
            ->select(
                DB::raw("strftime('%Y-%m', created_at) as month"),
                DB::raw('COUNT(*) as count')
            )
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->toArray();
    }
}