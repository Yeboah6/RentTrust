<?php

namespace App\Services;

use App\Models\Rental;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class FeaturedListingService
{
    private const ALLOWED_PURPOSES = ['rent', 'sale'];
    private const CACHE_TTL_MINUTES = 30;
    private const CACHE_KEY_PREFIX = 'featured_listings:';
    private const FEATURED_DURATION_HOURS = 48; // 2 days
    private const MAX_ACTIVE_FEATURED = 10;
    private const MAX_TIMES_FEATURED = 3; // Maximum times a listing can be featured
    private const COOLDOWN_DAYS = 7; // Days before a listing can be featured again

    /**
     * Get listings for homepage display.
     * Qualifies only when: is_featured = true AND featured_at is within FEATURED_DURATION_HOURS.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getFeaturedListings(string $purpose, int $limit = 5): array
    {
        $this->validatePurpose($purpose);

        return Cache::remember(
            $this->getCacheKey($purpose),
            now()->addMinutes(self::CACHE_TTL_MINUTES),
            fn () => $this->fetch($purpose, $limit)
        );
    }

    /**
     * Add a listing to the featured queue or activate immediately if slots available.
     */
    public function addToFeaturedQueue(Rental $rental, int $priority = 0): array
    {
        // Check if listing can be featured again
        if (!$this->canBeFeatured($rental)) {
            throw new \RuntimeException('Listing cannot be featured at this time. Check cooldown period or max times featured.');
        }

        $activeCount = $this->getActiveFeaturedCount();
        
        if ($activeCount < self::MAX_ACTIVE_FEATURED) {
            // Activate immediately
            return $this->activateNow($rental, $priority);
        } else {
            // Add to queue
            return $this->addToQueue($rental, $priority);
        }
    }

    /**
     * Add multiple listings to the featured queue.
     */
    public function addMultipleToFeaturedQueue(array $rentalIds, array $priorities = []): array
    {
        $result = [
            'activated' => 0,
            'queued' => 0,
            'skipped' => 0,
            'errors' => [],
        ];

        foreach ($rentalIds as $index => $rentalId) {
            try {
                $rental = Rental::findOrFail($rentalId);
                $priority = $priorities[$index] ?? 0;
                $response = $this->addToFeaturedQueue($rental, $priority);
                
                if ($response['status'] === 'activated') {
                    $result['activated']++;
                } elseif ($response['status'] === 'queued') {
                    $result['queued']++;
                }
            } catch (\Exception $e) {
                $result['skipped']++;
                $result['errors'][] = "Listing #{$rentalId}: {$e->getMessage()}";
            }
        }

        // Clear cache if any changes were made
        if ($result['activated'] > 0 || $result['queued'] > 0) {
            $this->clearCache();
        }

        return $result;
    }

    /**
     * Rotate featured listings: deactivate expired, promote from queue.
     */
    public function rotateFeaturedListings(): array
    {
        $result = [
            'deactivated' => 0,
            'promoted_from_queue' => 0,
            'queue_reordered' => false,
        ];

        // 1. Deactivate expired listings
        $result['deactivated'] = $this->deactivateExpiredListings();

        // 2. Promote from queue to fill available slots
        $activeCount = $this->getActiveFeaturedCount();
        $slotsAvailable = self::MAX_ACTIVE_FEATURED - $activeCount;

        if ($slotsAvailable > 0) {
            $result['promoted_from_queue'] = $this->promoteFromQueue($slotsAvailable);
        }

        // 3. Reorder queue positions
        $this->reorderQueue();

        // Clear all caches
        $this->clearCache();

        return $result;
    }

    /**
     * Get queue statistics.
     */
    public function getQueueStats(): array
    {
        return [
            'active_featured' => $this->getActiveFeaturedCount(),
            'queued' => Rental::where('is_featured_queued', true)->count(),
            'slots_available' => max(0, self::MAX_ACTIVE_FEATURED - $this->getActiveFeaturedCount()),
            'next_rotation' => $this->getNextRotationTime(),
        ];
    }

    // -------------------------------------------------------------------------
    // Private helper methods
    // -------------------------------------------------------------------------

    private function activateNow(Rental $rental, int $priority): array
    {
        $rental->update([
            'is_featured' => true,
            'is_featured_queued' => false,
            'featured_at' => now(),
            'featured_priority' => $priority,
            'last_featured_at' => now(),
            'times_featured' => ($rental->times_featured ?? 0) + 1,
            'featured_queue_position' => null,
        ]);

        $this->clearCache($rental->purpose);

        return [
            'status' => 'activated',
            'listing_id' => $rental->id,
            'featured_until' => now()->addHours(self::FEATURED_DURATION_HOURS),
        ];
    }

    private function addToQueue(Rental $rental, int $priority): array
    {
        // Get the next queue position
        $lastPosition = Rental::where('is_featured_queued', true)
            ->max('featured_queue_position') ?? 0;

        $rental->update([
            'is_featured_queued' => true,
            'queued_at' => now(),
            'featured_queue_position' => $lastPosition + 1,
            'featured_priority' => $priority,
        ]);

        return [
            'status' => 'queued',
            'listing_id' => $rental->id,
            'queue_position' => $lastPosition + 1,
            'estimated_activation' => $this->estimateActivationTime($lastPosition + 1),
        ];
    }

    private function promoteFromQueue(int $slots): int
    {
        $queuedListings = Rental::where('is_featured_queued', true)
            ->where('is_featured', false)
            ->orderBy('featured_queue_position')
            ->orderBy('featured_priority', 'desc')
            ->orderBy('queued_at')
            ->limit($slots)
            ->get();

        $promoted = 0;
        foreach ($queuedListings as $listing) {
            if ($this->canBeFeatured($listing)) {
                $listing->update([
                    'is_featured' => true,
                    'is_featured_queued' => false,
                    'featured_at' => now(),
                    'featured_queue_position' => null,
                    'last_featured_at' => now(),
                    'times_featured' => ($listing->times_featured ?? 0) + 1,
                ]);
                $promoted++;
            } else {
                // Remove from queue if can't be featured
                $listing->update([
                    'is_featured_queued' => false,
                    'featured_queue_position' => null,
                ]);
            }
        }

        return $promoted;
    }

    private function deactivateExpiredListings(): int
    {
        $expiredListings = Rental::where('is_featured', true)
            ->where(fn ($query) => $this->whereFeatureExpired($query))
            ->get();

        $count = 0;
        foreach ($expiredListings as $listing) {
            $listing->update([
                'is_featured' => false,
                'featured_priority' => 0,
            ]);
            $count++;
        }

        return $count;
    }

    private function whereFeatureExpired($query)
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'sqlite') {
            return $query->whereRaw(
                "datetime(featured_at, '+' || ? || ' hours') <= datetime('now')",
                [self::FEATURED_DURATION_HOURS]
            );
        } elseif ($driver === 'mysql') {
            return $query->whereRaw(
                'DATE_ADD(featured_at, INTERVAL ? HOUR) <= NOW()',
                [self::FEATURED_DURATION_HOURS]
            );
        } else {
            return $query->whereRaw(
                'featured_at + INTERVAL ? HOUR <= NOW()',
                [self::FEATURED_DURATION_HOURS]
            );
        }
    }

    private function reorderQueue(): void
    {
        $queuedListings = Rental::where('is_featured_queued', true)
            ->orderBy('featured_queue_position')
            ->get();

        $position = 1;
        foreach ($queuedListings as $listing) {
            $listing->update(['featured_queue_position' => $position]);
            $position++;
        }
    }

    private function canBeFeatured(Rental $rental): bool
    {
        // Check max times featured
        if (($rental->times_featured ?? 0) >= self::MAX_TIMES_FEATURED) {
            return false;
        }

        // Check cooldown period
        if ($rental->last_featured_at) {
            $cooldownEnds = $rental->last_featured_at->addDays(self::COOLDOWN_DAYS);
            if (now()->lt($cooldownEnds)) {
                return false;
            }
        }

        // Check if listing is active
        if ($rental->status !== 'active') {
            return false;
        }

        // For sale listings, check not sold
        if ($rental->purpose === 'sale' && $rental->is_sold) {
            return false;
        }

        return true;
    }

    private function getActiveFeaturedCount(): int
    {
        return Rental::where('is_featured', true)
            ->where(fn ($query) => $this->whereFeatureNotExpired($query))
            ->count();
    }

    private function estimateActivationTime(int $queuePosition): ?string
    {
        // Rough estimate: each listing takes 48 hours (featured duration)
        // Times the number of listings ahead in queue divided by max active
        $listingsAhead = $queuePosition - 1;
        $batchesNeeded = ceil($listingsAhead / self::MAX_ACTIVE_FEATURED);
        $hoursUntilActivation = $batchesNeeded * self::FEATURED_DURATION_HOURS;
        
        return now()->addHours($hoursUntilActivation)->toDateTimeString();
    }

    private function getNextRotationTime(): ?string
    {
        $nextExpiry = Rental::where('is_featured', true)
            ->whereNotNull('featured_at')
            ->min('featured_at');

        if ($nextExpiry) {
            return $nextExpiry->addHours(self::FEATURED_DURATION_HOURS)->toDateTimeString();
        }

        return null;
    }

    // private function getActiveFeaturedCount(): int
    // {
    //     return Rental::where('is_featured', true)
    //         ->where(fn ($query) => $this->whereFeatureNotExpired($query))
    //         ->count();
    // }

    /** Call after any listing change to ensure fresh results on next load. */
    public function clearCache(?string $purpose = null): void
    {
        if ($purpose !== null) {
            $this->validatePurpose($purpose);
            Cache::forget($this->getCacheKey($purpose));
        } else {
            // Clear all featured listing caches
            foreach (self::ALLOWED_PURPOSES as $p) {
                Cache::forget($this->getCacheKey($p));
            }
        }
    }

    // -------------------------------------------------------------------------

    /** @return array<int, array<string, mixed>> */
    private function fetch(string $purpose, int $limit): array
    {
        return Rental::with('user:id,name')
            ->select([
                'id', 'title', 'area', 'city', 'purpose',
                'rent_min', 'rent_max', 'sale_price', 'advance_duration',
                'status', 'is_featured', 'images', 'bedrooms', 'bathrooms', 'user_id',
                'featured_at',
            ])
            ->where('purpose', $purpose)
            ->when($purpose === 'sale', fn ($query) => $query->where('is_sold', false))
            ->where('is_featured', true)
            ->where(fn ($query) => $this->whereFeatureNotExpired($query))
            ->orderByDesc('featured_priority')
            ->orderByDesc('featured_at')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(fn (Rental $r) => $this->formatListing($r))
            ->all();
    }

    private function whereFeatureNotExpired($query)
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'sqlite') {
            return $query->whereRaw(
                "datetime(featured_at, '+' || ? || ' hours') > datetime('now')",
                [self::FEATURED_DURATION_HOURS]
            );
        } elseif ($driver === 'mysql') {
            return $query->whereRaw(
                'DATE_ADD(featured_at, INTERVAL ? HOUR) > NOW()',
                [self::FEATURED_DURATION_HOURS]
            );
        } else {
            return $query->whereRaw(
                'featured_at + INTERVAL ? HOUR > NOW()',
                [self::FEATURED_DURATION_HOURS]
            );
        }
    }

    private function formatListing(Rental $rental): array
    {
        $featuredEndsAt = $rental->featured_at
            ? $rental->featured_at->addHours(self::FEATURED_DURATION_HOURS)
            : null;

        $hoursRemaining = $featuredEndsAt
            ? now()->diffInHours($featuredEndsAt, absolute: false)
            : null;

        return [
            'id'               => $rental->id,
            'title'            => $rental->title,
            'area'             => $rental->area,
            'city'             => $rental->city,
            'purpose'          => $rental->purpose,
            'rent_min'         => $rental->rent_min,
            'rent_max'         => $rental->rent_max,
            'sale_price'       => $rental->sale_price,
            'advance_duration' => $rental->advance_duration,
            'status'           => $rental->status,
            'is_featured'      => (bool) $rental->is_featured,
            'images'           => $this->normaliseImages($rental->images),
            'bedrooms'         => $rental->bedrooms,
            'bathrooms'        => $rental->bathrooms,
            'agent_name'       => $rental->user?->name,
            'featured_ends_at' => $featuredEndsAt,
            'hours_remaining'  => max(0, $hoursRemaining ?? 0),
        ];
    }

    private function normaliseImages(mixed $images): array
    {
        if (is_string($images)) {
            $images = json_decode($images, true) ?? [];
        }
        return array_values(is_array($images) ? $images : []);
    }

    private function getCacheKey(string $purpose): string
    {
        return self::CACHE_KEY_PREFIX . $purpose;
    }

    private function validatePurpose(string $purpose): void
    {
        if (!in_array($purpose, self::ALLOWED_PURPOSES, true)) {
            throw new InvalidArgumentException("Invalid purpose: {$purpose}");
        }
    }
}