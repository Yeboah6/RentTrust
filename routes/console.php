<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\{Artisan, Log};
use Illuminate\Support\Facades\Schedule;
use App\Services\FeaturedListingService;

// Existing scheduled commands
Schedule::command('subscriptions:expire')->daily();
Schedule::command('featured:expire')->daily();
Schedule::command('sitemap:generate')->daily();

// Featured listings rotation - runs every hour
Schedule::call(function () {
    $service = app(FeaturedListingService::class);
    $result = $service->rotateFeaturedListings();
    
    Log::info('Featured rotation completed', [
        'deactivated' => $result['deactivated'],
        'promoted' => $result['promoted_from_queue'],
        'timestamp' => now(),
    ]);
})->hourly()
  ->name('featured-listings-rotate')
  ->description('Rotate featured listings: deactivate expired and promote from queue');

// Optional: Run more frequently during high-traffic periods
Schedule::call(function () {
    $service = app(FeaturedListingService::class);
    $result = $service->rotateFeaturedListings();
    
    Log::info('Featured rotation (30min check) completed', [
        'deactivated' => $result['deactivated'],
        'promoted' => $result['promoted_from_queue'],
    ]);
})->everyThirtyMinutes()
  ->name('featured-listings-rotate-30min')
  ->description('Additional featured listing rotation check');

// Display inspiring quote
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Optional: Manual featured rotation command for testing/debugging
Artisan::command('featured:rotate', function () {
    $service = app(FeaturedListingService::class);
    $result = $service->rotateFeaturedListings();
    
    $this->info('Featured rotation completed manually');
    $this->table(
        ['Metric', 'Value'],
        [
            ['Deactivated', $result['deactivated']],
            ['Promoted from Queue', $result['promoted_from_queue']],
            ['Timestamp', now()->toDateTimeString()],
        ]
    );
    
    // Show queue stats
    $stats = $service->getQueueStats();
    $this->newLine();
    $this->info('Current Queue Status:');
    $this->table(
        ['Metric', 'Value'],
        [
            ['Active Featured', $stats['active_featured']],
            ['Queued Listings', $stats['queued']],
            ['Slots Available', $stats['slots_available']],
            ['Next Rotation', $stats['next_rotation'] ?? 'No active featured listings'],
        ]
    );
})->purpose('Manually rotate featured listings and show queue status');

// Optional: Clear featured cache command
Artisan::command('featured:clear-cache', function () {
    $service = app(FeaturedListingService::class);
    $service->clearCache();
    $this->info('Featured listings cache cleared successfully.');
})->purpose('Clear the featured listings cache');

// Optional: Show featured queue status
Artisan::command('featured:status', function () {
    $service = app(FeaturedListingService::class);
    $stats = $service->getQueueStats();
    
    $this->info('Featured Listings Status');
    $this->table(
        ['Metric', 'Value'],
        [
            ['Active Featured', $stats['active_featured']],
            ['Queued Listings', $stats['queued']],
            ['Maximum Slots', 10],
            ['Slots Available', $stats['slots_available']],
            ['Next Rotation', $stats['next_rotation'] ?? 'N/A'],
        ]
    );
    
    // Show queue details if there are queued listings
    if ($stats['queued'] > 0) {
        $this->newLine();
        $this->info('Queued Listings:');
        
        $queuedListings = \App\Models\Rental::where('is_featured_queued', true)
            ->orderBy('featured_queue_position')
            ->get(['id', 'title', 'featured_queue_position', 'queued_at', 'featured_priority']);
        
        $rows = $queuedListings->map(function ($listing) {
            return [
                $listing->id,
                $listing->title,
                '#' . $listing->featured_queue_position,
                $listing->featured_priority ?? 0,
                $listing->queued_at ? $listing->queued_at->diffForHumans() : 'N/A',
            ];
        })->toArray();
        
        $this->table(
            ['ID', 'Title', 'Position', 'Priority', 'Queued'],
            $rows
        );
    }
})->purpose('Show featured listings queue status');