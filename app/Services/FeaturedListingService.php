<?php

namespace App\Services;

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
        // Check if user owns the listing
        if ($listing->user_id !== $user->id) {
            throw new Exception('You can only feature your own listings.');
        }

        // Check if listing is active
        if ($listing->status !== 'approved') {
            throw new Exception('Only approved listings can be featured.');
        }

        // Get user's plan
        $plan = $user->subscription?->plan;
        if (!$plan) {
            // Free plan fallback
            $plan = \App\Models\Plan::where('slug', 'free')->first();
        }

        // Check featured limit
        $activeFeaturedCount = Rental::where('user_id', $user->id)
            ->where('is_featured', true)
            ->where('featured_expires_at', '>', now())
            ->count();

        if ($activeFeaturedCount >= $plan->featured_limit) {
            throw new Exception("You have reached your featured listing limit of {$plan->featured_limit}. Upgrade your plan to feature more listings.");
        }

        // Feature the listing
        $listing->update([
            'is_featured' => true,
            'featured_at' => now(),
            'featured_expires_at' => now()->addDays($plan->featured_duration_days),
        ]);

        // Clear cache
        $this->clearCache();
    }

    /**
     * Get featured listings for homepage display
     */
    public function getFeaturedListings(string $purpose, int $limit = 8): Collection
    {
        return Cache::remember(
            "homepage_featured_{$purpose}s",
            now()->addHours(1), // Cache for 1 hour for rotation
            fn() => $this->selectFeaturedListings($purpose, $limit)
        );
    }

    /**
     * Select random featured listings
     */
    private function selectFeaturedListings(string $purpose, int $limit): Collection
    {
        return Rental::where('purpose', $purpose)
            ->where('is_featured', true)
            ->where('featured_expires_at', '>', now())
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }

    /**
     * Clear featured listings cache
     */
    public function clearCache(): void
    {
        Cache::forget('homepage_featured_rents');
        Cache::forget('homepage_featured_sales');
    }

    /**
     * Get user's active featured listings count
     */
    public function getActiveFeaturedCount(User $user): int
    {
        return Rental::where('user_id', $user->id)
            ->where('is_featured', true)
            ->where('featured_expires_at', '>', now())
            ->count();
    }

    /**
     * Check if user can feature more listings
     */
    public function canFeatureMore(User $user): bool
    {
        $plan = $user->subscription?->plan ?? \App\Models\Plan::where('slug', 'free')->first();
        $activeCount = $this->getActiveFeaturedCount($user);
        
        return $activeCount < $plan->featured_limit;
    }
}