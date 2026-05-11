<?php

namespace App\Services;

use App\Models\Plan;
use App\Models\Rental;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Collection;
use Exception;

class FeaturedListingService
{
    /**
     * Feature a listing for a user
     */
    public function featureListing(User $user, Rental $listing): void
    {
        if ($listing->user_id !== $user->id) {
            throw new Exception('You can only feature your own listings.');
        }

        if ($listing->status !== 'approved') {
            throw new Exception('Only approved listings can be featured.');
        }

        $plan = $user->subscription?->plan ?? Plan::where('slug', 'free')->firstOrFail();

        $activeFeaturedCount = Rental::where('user_id', $user->id)
            ->where('is_featured', true)
            ->where('featured_expires_at', '>', now())
            ->count();

        if ($activeFeaturedCount >= $plan->featured_limit) {
            throw new Exception(
                "You have reached your featured listing limit of {$plan->featured_limit}. Upgrade your plan to feature more listings."
            );
        }

        $listing->update([
            'is_featured'          => true,
            'featured_at'          => now(),
            'featured_expires_at'  => now()->addDays($plan->featured_duration_days),
            'featured_priority'    => $this->resolveFeaturedPriority($plan),
        ]);

        $this->clearCache();
    }

    /**
     * Get featured listings for homepage display.
     * Returns active featured listings; falls back to recent approved listings
     * when fewer than $limit featured ones exist.
     */
    public function getFeaturedListings(string $purpose, int $limit = 8): Collection
    {
        $cacheKey = "homepage_featured_{$purpose}";

        return Cache::remember(
            $cacheKey,
            now()->addHour(),
            fn () => $this->selectFeaturedListings($purpose, $limit)
        );
    }

    /**
     * Select featured listings with plan-aware weighted rotation,
     * padded with recent approved listings when not enough featured ones exist.
     */
    private function selectFeaturedListings(string $purpose, int $limit): Collection
    {
        // 1. Fetch only active featured listings
        $featured = Rental::where('purpose', $purpose)
            ->where('status', 'approved')
            ->where('is_featured', true)
            ->where('featured_expires_at', '>', now())
            ->orderByDesc('featured_priority')
            ->orderBy('featured_at')
            ->get();

        // 2. Apply weighted rotation so higher-priority plans appear more often
        $rotated = $this->weightedFeaturedRotation($featured, $limit);

        // 3. If we still need more cards, pad with recent approved (non-featured) listings
        if ($rotated->count() < $limit) {
            $needed        = $limit - $rotated->count();
            $excludeIds    = $rotated->pluck('id');

            $padding = Rental::where('purpose', $purpose)
                ->where('status', 'approved')
                ->whereNotIn('id', $excludeIds)
                ->orderByDesc('created_at')
                ->limit($needed)
                ->get();

            $rotated = $rotated->concat($padding);
        }

        return $rotated->values();
    }

    /**
     * De-duplicate first, then weight-shuffle so the pool isn't skewed.
     */
    private function weightedFeaturedRotation(Collection $listings, int $limit): Collection
    {
        // De-duplicate before expanding weights to keep pool size predictable
        $unique = $listings->unique('id')->values();

        $weighted = $unique->flatMap(function (Rental $listing) {
            $weight = max(1, (int) $listing->featured_priority);
            return array_fill(0, $weight, $listing);
        });

        // Shuffle the weighted pool, then pick unique items up to $limit
        return $weighted
            ->shuffle()
            ->unique('id')
            ->values()
            ->take($limit);
    }

    private function resolveFeaturedPriority(Plan $plan): int
    {
        return match (strtolower($plan->slug)) {
            'elite' => 3,
            'pro'   => 2,
            default => $plan->priority_ranking ? 2 : 1,
        };
    }

    /**
     * Clear featured listings cache for both purposes.
     */
    public function clearCache(): void
    {
        Cache::forget('homepage_featured_rent');
        Cache::forget('homepage_featured_sale');
    }

    /**
     * Get user's active featured listings count.
     */
    public function getActiveFeaturedCount(User $user): int
    {
        return Rental::where('user_id', $user->id)
            ->where('is_featured', true)
            ->where('featured_expires_at', '>', now())
            ->count();
    }

    /**
     * Check if user can feature more listings.
     */
    public function canFeatureMore(User $user): bool
    {
        $plan        = $user->subscription?->plan ?? Plan::where('slug', 'free')->first();
        $activeCount = $this->getActiveFeaturedCount($user);

        return $activeCount < $plan->featured_limit;
    }
}