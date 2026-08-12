<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Rental;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\ListingView;
use App\Models\ListingInquiry;
use App\Models\AgentVerification;
use App\Models\ListingVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    private function monthFormat(string $column): string
    {
        $driver = DB::getDriverName();

        return $driver === 'sqlite'
            ? "strftime('%Y-%m', {$column})"
            : "DATE_FORMAT({$column}, '%Y-%m')";
    }
    
    private function resolveFrom(string $range): Carbon
    {
        return match (strtoupper($range)) {
            '7D'  => now()->subDays(7),
            '30D' => now()->subDays(30),
            '3M'  => now()->subMonths(3),
            '12M' => now()->subMonths(12),
            'ALL' => Carbon::createFromDate(2000, 1, 1),
            default => now()->subMonths(6), // 6M
        };
    }

    // ── Main action ───────────────────────────────────────────────────────────

    public function index(Request $request)
    {
        $range = $request->input('range', '6M');
        $from  = $this->resolveFrom($range);
        $to    = now();

        $monthFmt = $this->monthFormat('created_at');

        // ── Revenue / Payments ────────────────────────────────────────────────

        $paymentsBase = Payment::whereBetween('created_at', [$from, $to]);

        $totalRevenue = (clone $paymentsBase)->where('status', 'success')->sum('amount');
        $avgPayment   = (clone $paymentsBase)->where('status', 'success')->avg('amount') ?? 0;

        $monthlyRevenue = (clone $paymentsBase)
            ->where('status', 'success')
            ->select(
                DB::raw("{$monthFmt} as month"),
                DB::raw('SUM(amount) as revenue'),
                DB::raw('COUNT(*) as transactions')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($r) => [
                'month'        => $r->month,
                'revenue'      => (float) $r->revenue,
                'transactions' => (int)   $r->transactions,
            ]);

        $providerSplit = (clone $paymentsBase)
            ->where('status', 'success')
            ->select(
                'provider',
                DB::raw('SUM(amount) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('provider')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($r) => [
                'provider' => $r->provider,
                'total'    => (float) $r->total,
                'count'    => (int)   $r->count,
            ]);

        $statusBreakdown = Payment::whereBetween('created_at', [$from, $to])
            ->select(
                'status',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(amount) as total')
            )
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn ($r) => [
                $r->status => [
                    'count' => (int)   $r->count,
                    'total' => (float) $r->total,
                ],
            ]);

        // Ensure all four keys exist
        foreach (['success', 'failed', 'pending', 'refunded'] as $key) {
            if (!isset($statusBreakdown[$key])) {
                $statusBreakdown[$key] = ['count' => 0, 'total' => 0];
            }
        }

        // ── Subscriptions ─────────────────────────────────────────────────────

        $subscriptionSummary = Subscription::select(
            'status',
            DB::raw('COUNT(*) as count')
        )
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn ($r) => [$r->status => (int) $r->count]);

        foreach (['active', 'cancelled', 'expired', 'pending'] as $key) {
            if (!isset($subscriptionSummary[$key])) {
                $subscriptionSummary[$key] = 0;
            }
        }

        $monthlyNewSubs = Subscription::whereBetween('created_at', [$from, $to])
            ->select(
                DB::raw("{$monthFmt} as month"),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($r) => [
                'month' => $r->month,
                'count' => (int) $r->count,
            ]);

        // ── Users ─────────────────────────────────────────────────────────────

        $totalUsers      = User::count();
        $newUsersPeriod  = User::whereBetween('created_at', [$from, $to])->count();

        $userGrowth = User::whereBetween('created_at', [$from, $to])
            ->select(
                DB::raw("{$monthFmt} as month"),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($r) => [
                'month' => $r->month,
                'count' => (int) $r->count,
            ]);

        $usersByRole = User::select('role', DB::raw('COUNT(*) as count'))
            ->groupBy('role')
            ->get()
            ->map(fn ($r) => ['role' => $r->role, 'count' => (int) $r->count]);

        $usersByPackage = User::select('package', DB::raw('COUNT(*) as count'))
            ->whereNotNull('package')
            ->groupBy('package')
            ->get()
            ->map(fn ($r) => ['package' => $r->package, 'count' => (int) $r->count]);

        // ── Listings ──────────────────────────────────────────────────────────

        $totalListings   = Rental::count();
        $activeListings  = Rental::where('status', 'active')->where('is_sold', false)->count();
        $soldStatusListings = Rental::where('status', 'sold')->count();
        $rentedStatusListings = Rental::where('status', 'rented')->count();
        $inactiveListings = Rental::where('status', 'inactive')->count();
        $pendingListings = $soldStatusListings +  $rentedStatusListings + $inactiveListings;
        $soldListings    = Rental::where('is_sold', true)->count();
        $rentedListings  = Rental::where('purpose', 'rent')->where('status', 'rented')->count();



        $listingStats = [
            'total'    => $totalListings,
            'active'   => $activeListings,
            'pending'  => $pendingListings,
            'sold'     => $soldListings,
            'rented'   => $rentedListings,
        ];

        $listingsByType = Rental::select('property_type', DB::raw('COUNT(*) as count'))
            ->whereNotNull('property_type')
            ->groupBy('property_type')
            ->orderByDesc('count')
            ->get()
            ->map(fn ($r) => ['property_type' => $r->property_type, 'count' => (int) $r->count]);

        $listingsByCity = Rental::select('city', DB::raw('COUNT(*) as count'))
            ->whereNotNull('city')
            ->groupBy('city')
            ->orderByDesc('count')
            ->limit(8)
            ->get()
            ->map(fn ($r) => ['city' => $r->city, 'count' => (int) $r->count]);

        $listingsByPurpose = Rental::select('purpose', DB::raw('COUNT(*) as count'))
            ->whereNotNull('purpose')
            ->groupBy('purpose')
            ->get()
            ->map(fn ($r) => ['purpose' => $r->purpose, 'count' => (int) $r->count]);

        $listingGrowth = Rental::whereBetween('created_at', [$from, $to])
            ->select(
                DB::raw("{$monthFmt} as month"),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($r) => ['month' => $r->month, 'count' => (int) $r->count]);

        // ── Views ─────────────────────────────────────────────────────────────

        $viewMonthFmt = $this->monthFormat('listing_views.created_at');

        $totalViews    = ListingView::whereBetween('created_at', [$from, $to])->count();
        $uniqueViewers = ListingView::whereBetween('created_at', [$from, $to])
            ->distinct('ip')
            ->count('ip');

        $viewsOverTime = ListingView::whereBetween('created_at', [$from, $to])
            ->select(
                DB::raw("{$viewMonthFmt} as month"),
                DB::raw('COUNT(*) as views'),
                DB::raw('COUNT(DISTINCT ip) as unique_viewers')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($r) => [
                'month'          => $r->month,
                'views'          => (int) $r->views,
                'unique_viewers' => (int) $r->unique_viewers,
            ]);

        // Top listings by views (within period)
        $topListings = ListingView::whereBetween('listing_views.created_at', [$from, $to])
            ->join('rentals', 'rentals.id', '=', 'listing_views.rental_id')
            ->select(
                'rentals.title',
                'rentals.city',
                'rentals.property_type',
                DB::raw('COUNT(listing_views.id) as views'),
                DB::raw('COUNT(DISTINCT listing_views.ip) as unique_views')
            )
            ->groupBy('rentals.id', 'rentals.title', 'rentals.city', 'rentals.property_type')
            ->orderByDesc('views')
            ->limit(5)
            ->get()
            ->map(fn ($r) => [
                'title'         => $r->title,
                'city'          => $r->city,
                'property_type' => $r->property_type,
                'views'         => (int) $r->views,
                'unique_views'  => (int) $r->unique_views,
            ]);

        // ── Inquiries ─────────────────────────────────────────────────────────

        $inqBase = ListingInquiry::whereBetween('created_at', [$from, $to]);

        $inquiriesTotal     = (clone $inqBase)->count();
        $inquiriesFromUsers = (clone $inqBase)->whereNotNull('user_id')->count();
        $inquiriesFromGuests= $inquiriesTotal - $inquiriesFromUsers;

        $inquiriesByType = (clone $inqBase)
            ->select('type', DB::raw('COUNT(*) as count'))
            ->groupBy('type')
            ->orderByDesc('count')
            ->get()
            ->map(fn ($r) => ['type' => $r->type, 'count' => (int) $r->count]);

        $inqMonthFmt = $this->monthFormat('created_at');
        $inquiriesOverTime = (clone $inqBase)
            ->select(
                DB::raw("{$inqMonthFmt} as month"),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($r) => ['month' => $r->month, 'count' => (int) $r->count]);

        // ── Verifications ────────────────────────────────────────────────────

        $verMonthFmt = $this->monthFormat('created_at');

        $agentVerBase   = AgentVerification::whereBetween('created_at', [$from, $to]);
        $listingVerBase = ListingVerification::whereBetween('created_at', [$from, $to]);

        $agentVerStats = [
            'approved' => (clone $agentVerBase)->where('status', 'approved')->count(),
            'pending'  => (clone $agentVerBase)->where('status', 'pending')->count(),
            'rejected' => (clone $agentVerBase)->where('status', 'rejected')->count(),
        ];

        $listingVerStats = [
            'approved' => (clone $listingVerBase)->where('status', 'approved')->count(),
            'pending'  => (clone $listingVerBase)->where('status', 'pending')->count(),
            'rejected' => (clone $listingVerBase)->where('status', 'rejected')->count(),
        ];

        $agentVerGrowth = (clone $agentVerBase)
            ->select(DB::raw("{$verMonthFmt} as month"), DB::raw('COUNT(*) as count'))
            ->groupBy('month')->orderBy('month')->get()
            ->map(fn ($r) => ['month' => $r->month, 'count' => (int) $r->count]);

        $listingVerGrowth = (clone $listingVerBase)
            ->select(DB::raw("{$verMonthFmt} as month"), DB::raw('COUNT(*) as count'))
            ->groupBy('month')->orderBy('month')->get()
            ->map(fn ($r) => ['month' => $r->month, 'count' => (int) $r->count]);

        // ── Assemble and return ───────────────────────────────────────────────

        return Inertia::render('SuperAdmin/Analytics/Index', [
            'analytics' => [
                'range'    => strtoupper($range),
                'from'     => $from->format('M Y'),
                'to'       => $to->format('M Y'),

                // Revenue
                'total_revenue'     => (float) $totalRevenue,
                'avg_payment'       => (float) round($avgPayment, 2),
                'monthly_revenue'   => $monthlyRevenue,
                'provider_split'    => $providerSplit,
                'status_breakdown'  => $statusBreakdown,

                // Subscriptions
                'subscription_summary' => $subscriptionSummary,
                'monthly_new_subs'     => $monthlyNewSubs,

                // Users
                'total_users'      => $totalUsers,
                'new_users_period' => $newUsersPeriod,
                'user_growth'      => $userGrowth,
                'users_by_role'    => $usersByRole,
                'users_by_package' => $usersByPackage,

                // Listings
                'listing_stats'      => $listingStats,
                'listings_by_type'   => $listingsByType,
                'listings_by_city'   => $listingsByCity,
                'listings_by_purpose'=> $listingsByPurpose,
                'listing_growth'     => $listingGrowth,

                // Views
                'total_views'    => $totalViews,
                'unique_viewers' => $uniqueViewers,
                'views_over_time'=> $viewsOverTime,
                'top_listings'   => $topListings,

                // Inquiries
                'inquiries_summary' => [
                    'total'       => $inquiriesTotal,
                    'from_users'  => $inquiriesFromUsers,
                    'from_guests' => $inquiriesFromGuests,
                ],
                'inquiries_by_type'   => $inquiriesByType,
                'inquiries_over_time' => $inquiriesOverTime,

                // Verifications
                'verifications' => [
                    'agent'          => $agentVerStats,
                    'listing'        => $listingVerStats,
                    'agent_growth'   => $agentVerGrowth,
                    'listing_growth' => $listingVerGrowth,
                ],
            ],
        ]);
    }
}