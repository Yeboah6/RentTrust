<?php

namespace App\Console\Commands;

use App\Models\Rental;
use Illuminate\Console\Command;

class ExpireFeaturedListings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'featured:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expire featured listings that have passed their expiry date';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expiredCount = Rental::where('is_featured', true)
            ->where('featured_expires_at', '<=', now())
            ->update([
                'is_featured' => false,
                'featured_at' => null,
                'featured_expires_at' => null,
            ]);

        $this->info("Expired {$expiredCount} featured listings.");
    }
}
