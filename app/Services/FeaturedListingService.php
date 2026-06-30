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
    private const FEATURED_DURATION_HOURS = 48;
    private const MAX_ACTIVE_FEATURED = 10;
    private const MAX_TIMES_FEATURED = 3;
    private const COOLDOWN_DAYS = 7;

    /**
     * Get listings for homepage display.
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
        if (!$this->canBeFeatured($rental)) {
            throw new \RuntimeException('Listing cannot be featured at this time. Check cooldown period or max times featured.');
        }

        $activeCount = $this->getActiveFeaturedCount();

        if ($activeCount < self::MAX_ACTIVE_FEATURED) {
            return $this->activateNow($rental, $priority);
        } else {
            return $this->addToQueue($rental, $priority);
        }
    }

    /**
     * Rotate featured listings: deactivate expired, promote from queue.
     */
    public function rotateFeaturedListings(): array
    {
        $result = [
            'deactivated' => 0,
            'promoted_from_queue' => 0,
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

        $this->clearCache();

        return $result;
    }

    /** Clear cache for a specific purpose or all. */
    public function clearCache(?string $purpose = null): void
    {
        if ($purpose !== null) {
            $this->validatePurpose($purpose);
            Cache::forget($this->getCacheKey($purpose));
        } else {
            foreach (self::ALLOWED_PURPOSES as $p) {
                Cache::forget($this->getCacheKey($p));
            }
        }
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
            'next_rotation' => Rental::where('is_featured', true)
                                    ->min('featured_expires_at'), // next expiry
        ];
    }

    // -------------------------------------------------------------------------

    private function activateNow(Rental $rental, int $priority): array
    {
        $now = now();
        $rental->update([
            'is_featured'          => true,
            'is_featured_queued'   => false,
            'featured_at'          => $now,
            'featured_expires_at'  => $now->copy()->addHours(self::FEATURED_DURATION_HOURS),
            'featured_priority'    => $priority,
            'last_featured_at'     => $now,
            'times_featured'       => ($rental->times_featured ?? 0) + 1,
            'featured_queue_position' => null,
        ]);

        $this->clearCache($rental->purpose);

        return [
            'status' => 'activated',
            'listing_id' => $rental->id,
            'featured_until' => $rental->featured_expires_at,
        ];
    }

    private function addToQueue(Rental $rental, int $priority): array
    {
        $lastPosition = Rental::where('is_featured_queued', true)
                            ->max('featured_queue_position') ?? 0;

        $rental->update([
            'is_featured_queued'    => true,
            'queued_at'             => now(),
            'featured_queue_position' => $lastPosition + 1,
            'featured_priority'     => $priority,
        ]);

        return [
            'status' => 'queued',
            'listing_id' => $rental->id,
            'queue_position' => $lastPosition + 1,
            'estimated_activation' => now()->addHours(
                ceil(($lastPosition + 1) / self::MAX_ACTIVE_FEATURED) * self::FEATURED_DURATION_HOURS
            ),
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
                $this->activateNow($listing, $listing->featured_priority ?? 0);
                $promoted++;
            } else {
                // Remove from queue if can't be featured anymore
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
        $expired = Rental::where('is_featured', true)
            ->where('featured_expires_at', '<=', now())
            ->get();

        foreach ($expired as $listing) {
            $listing->update([
                'is_featured' => false,
                'featured_priority' => 0,
                // featured_at and featured_expires_at remain for history
            ]);
        }
        return $expired->count();
    }

    private function reorderQueue(): void
    {
        $queued = Rental::where('is_featured_queued', true)
            ->orderBy('featured_queue_position')
            ->get();

        $position = 1;
        foreach ($queued as $listing) {
            $listing->update(['featured_queue_position' => $position]);
            $position++;
        }
    }

    private function canBeFeatured(Rental $rental): bool
    {
        // Max times featured check
        if (($rental->times_featured ?? 0) >= self::MAX_TIMES_FEATURED) {
            return false;
        }
        // Cooldown check
        if ($rental->last_featured_at && $rental->last_featured_at->diffInDays(now()) < self::COOLDOWN_DAYS) {
            return false;
        }
        // Only active listings can be featured
        if ($rental->status !== 'approved') {
            return false;
        }
        // For sale listings, not sold
        if ($rental->purpose === 'sale' && $rental->is_sold) {
            return false;
        }
        return true;
    }

    private function getActiveFeaturedCount(): int
    {
        return Rental::where('is_featured', true)
            ->where('featured_expires_at', '>', now())
            ->count();
    }

    // Query for retrieving featured listings (no raw SQL)
    private function fetch(string $purpose, int $limit): array
    {
        return Rental::with('user:id,name')
            ->select([
                'id', 'title', 'area', 'city', 'purpose',
                'rent_min', 'rent_max', 'sale_price', 'advance_duration',
                'status', 'is_featured', 'images', 'bedrooms', 'bathrooms', 'user_id',
                'featured_at', 'featured_expires_at',
            ])
            ->where('purpose', $purpose)
            ->when($purpose === 'sale', fn ($q) => $q->where('is_sold', false))
            ->where('is_featured', true)
            ->where('featured_expires_at', '>', now())  // simple!
            ->orderByDesc('featured_priority')
            ->orderByDesc('featured_at')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(fn (Rental $r) => $this->formatListing($r))
            ->all();
    }

    private function formatListing(Rental $rental): array
    {
        $hoursRemaining = $rental->featured_expires_at
            ? max(0, now()->diffInHours($rental->featured_expires_at, false))
            : 0;

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
            'featured_ends_at' => $rental->featured_expires_at,
            'hours_remaining'  => $hoursRemaining,
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