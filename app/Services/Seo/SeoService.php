<?php

namespace App\Services\Seo;

use App\Models\Rental;
use Illuminate\Support\Str;

class SeoService
{
    public function propertyMeta(Rental $rental): array
    {
        $purposeLabel = $rental->isSale() ? 'Sale' : 'Rent';
        $typeLabel = $this->normalizePropertyType($rental->property_type);

        $title = sprintf(
            '%s %s for %s in %s | %s',
            $rental->bedrooms ?? '1',
            $typeLabel,
            $purposeLabel,
            $rental->area,
            config('seo.site.name')
        );

        $description = trim($rental->description ?: "Discover a verified {$typeLabel} in {$rental->area}, Ghana. View photos, pricing, amenities and contact a local agent today.");

        return [
            'title' => Str::limit($title, 70),
            'description' => Str::limit($description, 160),
            'canonical' => $this->propertyCanonicalUrl($rental),
            'image' => $this->propertyImage($rental),
            'type' => $rental->isSale() ? 'article' : 'product',
            'locale' => config('seo.site.locale'),
            'siteName' => config('seo.site.name'),
            'twitter' => config('seo.site.twitter_handle'),
        ];
    }

    public function propertyCanonicalUrl(Rental $rental): string
    {
        $path = sprintf(
            '/%s/%s/%s',
            $rental->isSale() ? 'buy' : 'rent',
            Str::slug($rental->area),
            $rental->slug ?: $rental->id
        );

        return rtrim(config('app.url'), '/') . $path;
    }

    public function propertyImage(Rental $rental): string
    {
        $images = $rental->images;

        if (is_array($images) && count($images) > 0) {
            return rtrim(config('app.url'), '/') . '/storage/rental_images/' . ltrim($images[0], '/');
        }

        return config('seo.site.default_image');
    }

    public function areaMeta(string $areaSlug, string $purpose = 'rent'): array
    {
        $areaKey = Str::slug($areaSlug);
        $locationConfig = config("seo.location_pages.{$areaKey}", []);

        if (! empty($locationConfig)) {
            $title = $locationConfig['title'];
            $description = $locationConfig['description'];
            $canonical = rtrim(config('app.url'), '/') . '/' . ($purpose === 'sale' ? 'buy' : 'rent') . '/' . $areaKey;

            return [
                'title' => $title,
                'description' => $description,
                'canonical' => $canonical,
                'image' => config('seo.site.default_image'),
                'type' => 'website',
                'locale' => config('seo.site.locale'),
                'siteName' => config('seo.site.name'),
                'twitter' => config('seo.site.twitter_handle'),
                'h1' => $locationConfig['h1'],
                'keywords' => $locationConfig['keywords'],
            ];
        }

        $label = ucwords(str_replace('-', ' ', $areaSlug));
        $title = "{$label} Properties for " . ($purpose === 'sale' ? 'Sale' : 'Rent') . " | " . config('seo.site.name');
        $description = "Browse verified properties in {$label}. Find the latest rental and sale listings, neighbourhood insights, and local agents serving Ghana.";

        return [
            'title' => $title,
            'description' => Str::limit($description, 160),
            'canonical' => rtrim(config('app.url'), '/') . '/' . ($purpose === 'sale' ? 'buy' : 'rent') . '/' . $areaKey,
            'image' => config('seo.site.default_image'),
            'type' => 'website',
            'locale' => config('seo.site.locale'),
            'siteName' => config('seo.site.name'),
            'twitter' => config('seo.site.twitter_handle'),
            'h1' => "{$label} Properties",
        ];
    }

    public function blogMeta(array $post): array
    {
        $canonical = rtrim(config('app.url'), '/') . '/blog/' . $post['slug'];

        return [
            'title' => $post['title'] . ' | ' . config('seo.site.name'),
            'description' => Str::limit($post['excerpt'], 160),
            'canonical' => $canonical,
            'image' => $post['image'] ?? config('seo.site.default_image'),
            'type' => 'article',
            'locale' => config('seo.site.locale'),
            'siteName' => config('seo.site.name'),
            'twitter' => config('seo.site.twitter_handle'),
        ];
    }

    public function organizationSchema(): array
    {
        $organization = config('seo.organization');

        return [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => $organization['name'],
            'url' => $organization['url'],
            'logo' => $organization['logo'],
            'sameAs' => $organization['same_as'],
            'contactPoint' => $organization['contact_point'],
        ];
    }

    private function normalizePropertyType(?string $propertyType): string
    {
        if (! $propertyType) {
            return 'Residence';
        }

        if (Str::contains(strtolower($propertyType), 'apartment')) {
            return 'Apartment';
        }

        if (Str::contains(strtolower($propertyType), 'house')) {
            return 'House';
        }

        return Str::title($propertyType);
    }
}
