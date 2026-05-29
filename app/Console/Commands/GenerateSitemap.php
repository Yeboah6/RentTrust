<?php

namespace App\Console\Commands;

use App\Services\Seo\SitemapService;
use Illuminate\Console\Command;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';
    protected $description = 'Generate the RentTrustGh sitemap index and segmented sitemap files.';

    public function handle(SitemapService $sitemapService): int
    {
        $this->info('Starting sitemap generation...');

        $sitemapService->generateSitemaps();

        $this->info('Sitemap generation completed successfully.');

        return self::SUCCESS;
    }
}
