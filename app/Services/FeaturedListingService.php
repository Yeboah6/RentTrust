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

    /**
     * Get listings for homepage display.
     * Qualifies only when: is_featured = true AND featured_at is within FEATURED_DURATION_HOURS.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getFeaturedListings(string $purpose, int $limit = 8): array
    {
        $this->validatePurpose($purpose);

        return Cache::remember(
            $this->getCacheKey($purpose),
            now()->addMinutes(self::CACHE_TTL_MINUTES),
            fn () => $this->fetch($purpose, $limit)
        );
    }

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
            // SQLite: datetime(featured_at, '+48 hours') > current_timestamp
            return $query->whereRaw(
                "datetime(featured_at, '+' || ? || ' hours') > datetime('now')",
                [self::FEATURED_DURATION_HOURS]
            );
        } elseif ($driver === 'mysql') {
            // MySQL: DATE_ADD(featured_at, INTERVAL 48 HOUR) > NOW()
            return $query->whereRaw(
                'DATE_ADD(featured_at, INTERVAL ? HOUR) > NOW()',
                [self::FEATURED_DURATION_HOURS]
            );
        } else {
            // PostgreSQL and others: featured_at + INTERVAL '48 hours' > NOW()
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