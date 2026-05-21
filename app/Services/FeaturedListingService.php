<?php

namespace App\Services;

use App\Models\Rental;
use Illuminate\Support\Facades\Cache;

class FeaturedListingService
{
    private const LISTING_FIELDS = [
        'id', 'title', 'area', 'city', 'purpose',
        'rent_min', 'rent_max', 'sale_price', 'advance_duration',
        'status', 'is_featured', 'images', 'bedrooms', 'bathrooms', 'user_id',
    ];

    /**
     * Get listings for homepage display.
     * Qualifies only when: is_featured = true.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getFeaturedListings(string $purpose, int $limit = 8): array
    {
        return Cache::remember(
            "homepage_featured_{$purpose}",
            now()->addMinutes(30),
            fn () => $this->fetch($purpose, $limit)
        );
    }

    /** Call after any listing change to ensure fresh results on next load. */
    public function clearCache(): void
    {
        Cache::forget('homepage_featured_rent');
        Cache::forget('homepage_featured_sale');
    }

    // -------------------------------------------------------------------------

    /** @return array<int, array<string, mixed>> */
    private function fetch(string $purpose, int $limit): array
    {
        return Rental::with('user:id,name')
            ->select(self::LISTING_FIELDS)
            ->where('purpose', $purpose)
            ->when($purpose === 'sale', fn ($query) => $query->where('is_sold', false))
            ->where('is_featured', true)
            ->orderByDesc('featured_priority')
            ->orderByDesc('featured_at')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(fn (Rental $r) => [
                'id'               => $r->id,
                'title'            => $r->title,
                'area'             => $r->area,
                'city'             => $r->city,
                'purpose'          => $r->purpose,
                'rent_min'         => $r->rent_min,
                'rent_max'         => $r->rent_max,
                'sale_price'       => $r->sale_price,
                'advance_duration' => $r->advance_duration,
                'status'           => $r->status,
                'is_featured'      => (bool) $r->is_featured,
                'images'           => $this->normaliseImages($r->images),
                'bedrooms'         => $r->bedrooms,
                'bathrooms'        => $r->bathrooms,
                'agent_name'       => $r->user?->name,
            ])
            ->all();
    }

    private function normaliseImages(mixed $images): array
    {
        if (is_string($images)) {
            $images = json_decode($images, true) ?? [];
        }
        return array_values(is_array($images) ? $images : []);
    }
}