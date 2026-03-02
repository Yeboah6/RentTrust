<?php

namespace App\Services;

use App\Models\Rental;
use Illuminate\Support\Facades\Cache;

class ListingAnalyticsService
{
    // Cache duration in minutes
    private const CACHE_TTL = 10;

    /**
     * Get the total number of views for a listing.
     */
    public function getTotalViews(Rental $listing): int
    {
        return Cache::remember(
            "listing_views_total_{$listing->id}",
            self::CACHE_TTL * 60,
            fn() => $listing->views()->count()
        );
    }

    /**
     * Get unique views (by IP) for the last N days.
     */
    public function getUniqueViewsLastDays(Rental $listing, int $days = 7): int
    {
        return Cache::remember(
            "listing_views_unique_{$listing->id}_{$days}d",
            self::CACHE_TTL * 60,
            fn() => $listing->views()
                ->where('created_at', '>=', now()->subDays($days))
                ->distinct('ip')
                ->count('ip')
        );
    }

    /**
     * Get total inquiries for a listing.
     */
    public function getTotalInquiries(Rental $listing): int
    {
        return Cache::remember(
            "listing_inquiries_total_{$listing->id}",
            self::CACHE_TTL * 60,
            fn() => $listing->inquiries()->count()
        );
    }

    /**
     * Get inquiries for the last N days.
     */
    public function getInquiriesLastDays(Rental $listing, int $days = 7): int
    {
        return Cache::remember(
            "listing_inquiries_{$listing->id}_{$days}d",
            self::CACHE_TTL * 60,
            fn() => $listing->inquiries()
                ->where('created_at', '>=', now()->subDays($days))
                ->count()
        );
    }

    /**
     * Calculate conversion rate: (inquiries / views) * 100
     */
    public function getConversionRate(Rental $listing): float
    {
        $views = $this->getTotalViews($listing);

        if ($views === 0) {
            return 0.0;
        }

        $inquiries = $this->getTotalInquiries($listing);

        return ($inquiries / $views) * 100;
    }

    /**
     * Get conversion rate for a specific period.
     */
    public function getConversionRateLastDays(Rental $listing, int $days = 7): float
    {
        $views = $this->getUniqueViewsLastDays($listing, $days);

        if ($views === 0) {
            return 0.0;
        }

        $inquiries = $this->getInquiriesLastDays($listing, $days);

        return ($inquiries / $views) * 100;
    }

    /**
     * Calculate performance score.
     * Formula: (views × 1) + (inquiries × 3)
     */
    public function getPerformanceScore(Rental $listing): int
    {
        $views = $this->getTotalViews($listing);
        $inquiries = $this->getTotalInquiries($listing);

        return ($views * 1) + ($inquiries * 3);
    }

    /**
     * Get views by inquiry type breakdown.
     */
    public function getInquiriesByType(Rental $listing): array
    {
        return Cache::remember(
            "listing_inquiries_by_type_{$listing->id}",
            self::CACHE_TTL * 60,
            fn() => $listing->inquiries()
                ->groupBy('type')
                ->selectRaw('type, COUNT(*) as count')
                ->get()
                ->pluck('count', 'type')
                ->toArray()
        );
    }

    /**
     * Get comprehensive analytics summary for a listing.
     * Used to keep controller logic clean.
     */
    public function getListingAnalyticsSummary(Rental $listing): array
    {
        return [
            'rental_id' => $listing->id,
            'views_total' => $this->getTotalViews($listing),
            'views_7_days' => $this->getUniqueViewsLastDays($listing, 7),
            'views_30_days' => $this->getUniqueViewsLastDays($listing, 30),
            'inquiries_total' => $this->getTotalInquiries($listing),
            'inquiries_7_days' => $this->getInquiriesLastDays($listing, 7),
            'inquiries_30_days' => $this->getInquiriesLastDays($listing, 30),
            'conversion_rate_total' => round($this->getConversionRate($listing), 2),
            'conversion_rate_7_days' => round($this->getConversionRateLastDays($listing, 7), 2),
            'conversion_rate_30_days' => round($this->getConversionRateLastDays($listing, 30), 2),
            'performance_score' => $this->getPerformanceScore($listing),
            'inquiries_by_type' => $this->getInquiriesByType($listing),
        ];
    }

    /**
     * Clear cache for a listing (useful for testing or when data is updated).
     */
    public function clearCache(Rental $listing): void
    {
        $patterns = [
            "listing_views_total_{$listing->id}",
            "listing_views_unique_{$listing->id}_*",
            "listing_inquiries_total_{$listing->id}",
            "listing_inquiries_{$listing->id}_*",
            "listing_inquiries_by_type_{$listing->id}",
        ];

        foreach ($patterns as $pattern) {
            Cache::forget($pattern);
        }
    }
}
