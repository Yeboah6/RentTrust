<?php

namespace App\Services\Seo;

use App\Models\Location;
use App\Models\PropertyType;
use App\Models\Rental;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\SitemapIndex;
use Spatie\Sitemap\Tags\Url;

class SitemapService
{
    public function generateSitemaps(): void
    {
        try {
            $this->ensureDirectory();

            $this->generateRentalSitemap();
            $this->generateSaleSitemap();
            $this->generateCitySitemap();
            $this->generatePropertyTypeSitemap();
            $this->generateBlogSitemap();
            $this->generateAgentsSitemap();
            $this->generateStaticPagesSitemap();
            $this->generateIndex();
        } catch (\Throwable $exception) {
            Log::error('Sitemap generation failed: ' . $exception->getMessage(), [
                'trace' => $exception->getTraceAsString(),
            ]);
        }
    }

    protected function ensureDirectory(): void
    {
        File::ensureDirectoryExists(public_path('sitemaps'));
    }

    protected function baseUrl(): string
    {
        return rtrim(config('app.url'), '/');
    }

    protected function generateRentalSitemap(): void
    {
        $sitemap = Sitemap::create(public_path('sitemaps/listings-rent.xml'));

        Rental::where('purpose', 'rent')
            ->where('status', 'approved')
            ->where('is_sold', false)
            ->whereNotNull('slug')
            ->orderByDesc('updated_at')
            ->cursor()
            ->each(function (Rental $rental) use ($sitemap) {
                $sitemap->add(Url::create($this->baseUrl() . '/rent/' . $this->slugify($rental->area) . '/' . $rental->slug)
                    ->setLastModificationDate($rental->updated_at)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
                    ->setPriority(0.9));
            });

        $sitemap->writeToFile(public_path('sitemaps/listings-rent.xml'));
    }

    protected function generateSaleSitemap(): void
    {
        $sitemap = Sitemap::create(public_path('sitemaps/listings-buy.xml'));

        Rental::where('purpose', 'sale')
            ->where('status', 'approved')
            ->where('is_sold', false)
            ->whereNotNull('slug')
            ->orderByDesc('updated_at')
            ->cursor()
            ->each(function (Rental $rental) use ($sitemap) {
                $sitemap->add(Url::create($this->baseUrl() . '/buy/' . $this->slugify($rental->area) . '/' . $rental->slug)
                    ->setLastModificationDate($rental->updated_at)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
                    ->setPriority(0.9));
            });

        $sitemap->writeToFile(public_path('sitemaps/listings-buy.xml'));
    }

    protected function generateCitySitemap(): void
    {
        $sitemap = Sitemap::create(public_path('sitemaps/cities.xml'));

        Rental::select('city')
            ->where('status', 'approved')
            ->distinct()
            ->cursor()
            ->each(function ($row) use ($sitemap) {
                $citySlug = $this->slugify($row->city);
                $sitemap->add(Url::create($this->baseUrl() . '/rent/areas?city=' . $citySlug)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                    ->setPriority(0.7));

                $sitemap->add(Url::create($this->baseUrl() . '/buy/areas?city=' . $citySlug)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                    ->setPriority(0.7));
            });

        $sitemap->writeToFile(public_path('sitemaps/cities.xml'));
    }

    protected function generatePropertyTypeSitemap(): void
    {
        $sitemap = Sitemap::create(public_path('sitemaps/property-types.xml'));

        PropertyType::active()->get()->each(function (PropertyType $type) use ($sitemap) {
            $typeSlug = $this->slugify($type->slug ?: $type->name);
            $sitemap->add(Url::create($this->baseUrl() . '/rent/listings?type=' . $typeSlug)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.65));

            $sitemap->add(Url::create($this->baseUrl() . '/buy/listings?type=' . $typeSlug)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.65));
        });

        $sitemap->writeToFile(public_path('sitemaps/property-types.xml'));
    }

    protected function generateBlogSitemap(): void
    {
        $sitemap = Sitemap::create(public_path('sitemaps/blog.xml'));

        collect(config('seo.blog.posts', []))->each(function (array $post) use ($sitemap) {
            $sitemap->add(Url::create($this->baseUrl() . '/blog/' . $post['slug'])
                ->setLastModificationDate($post['published_at'])
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
                ->setPriority(0.5));
        });

        $sitemap->writeToFile(public_path('sitemaps/blog.xml'));
    }

    protected function generateAgentsSitemap(): void
    {
        $sitemap = Sitemap::create(public_path('sitemaps/agents.xml'));

        $sitemap->add(Url::create($this->baseUrl() . '/agents')
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
            ->setPriority(0.6));

        $sitemap->writeToFile(public_path('sitemaps/agents.xml'));
    }

    protected function generateStaticPagesSitemap(): void
    {
        $sitemap = Sitemap::create(public_path('sitemaps/static-pages.xml'));

        collect(config('seo.static_pages', []))->each(function (string $path) use ($sitemap) {
            $sitemap->add(Url::create($this->baseUrl() . $path)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
                ->setPriority(0.55));
        });

        $sitemap->writeToFile(public_path('sitemaps/static-pages.xml'));
    }

    protected function generateIndex(): void
    {
        $index = SitemapIndex::create(public_path('sitemap.xml'));

        foreach ([
            'sitemaps/listings-rent.xml',
            'sitemaps/listings-buy.xml',
            'sitemaps/cities.xml',
            'sitemaps/property-types.xml',
            'sitemaps/blog.xml',
            'sitemaps/agents.xml',
            'sitemaps/static-pages.xml',
        ] as $path) {
            $index->add($this->baseUrl() . '/' . ltrim($path, '/'));
        }

        $index->writeToFile(public_path('sitemap.xml'));
    }

    protected function slugify(string $value): string
    {
        return strtolower(str_replace('_', '-', trim(preg_replace('/[^A-Za-z0-9]+/', '-', $value), '-')));
    }
}
