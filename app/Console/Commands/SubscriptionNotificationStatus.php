<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;

class SubscriptionNotificationStatus extends Command
{
    protected $signature = 'subscriptions:status 
                            {id? : Subscription ID to check}
                            {--reset : Reset notification flags}';

    protected $description = 'Check or reset subscription notification status';

    public function handle(): int
    {
        $query = Subscription::with(['user', 'plan']);
        
        if ($id = $this->argument('id')) {
            $query->where('id', $id);
        }
        
        $subscriptions = $query->get();
        
        if ($subscriptions->isEmpty()) {
            $this->warn('No subscriptions found.');
            return Command::SUCCESS;
        }
        
        $this->table(
            ['ID', 'User', 'Plan', 'Status', 'Ends At', '15d', '7d', '1d'],
            $subscriptions->map(function ($sub) {
                return [
                    $sub->id,
                    $sub->user->email ?? 'N/A',
                    $sub->plan->name ?? 'N/A',
                    $sub->status,
                    $sub->ends_at ? $sub->ends_at->format('Y-m-d') : 'N/A',
                    $sub->notified_15_day_at ? '✓' : 'No',
                    $sub->notified_7_day_at ? '✓' : 'No',
                    $sub->notified_1_day_at ? '✓' : 'No',
                ];
            })
        );
        
        if ($this->option('reset')) {
            foreach ($subscriptions as $subscription) {
                $subscription->update([
                    'notified_15_day_at' => null,
                    'notified_7_day_at' => null,
                    'notified_1_day_at' => null,
                ]);
                $this->info("✓ Reset notification flags for subscription #{$subscription->id}");
            }
        }
        
        return Command::SUCCESS;
    }
}