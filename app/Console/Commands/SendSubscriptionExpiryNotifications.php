<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;
use App\Notifications\SubscriptionExpiringNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SendSubscriptionExpiryNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:notify-expiry 
                            {--days= : Specific days to check (comma-separated)}
                            {--dry-run : Run without actually sending notifications}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications to users about expiring subscriptions';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        // Define the notification intervals
        $intervals = [
            15 => 'notified_15_day_at',
            7 => 'notified_7_day_at',
            1 => 'notified_1_day_at',
        ];

        // Override intervals if specific days are provided
        if ($days = $this->option('days')) {
            $requestedDays = array_map('trim', explode(',', $days));
            $intervals = array_intersect_key($intervals, array_flip($requestedDays));
        }

        $this->info('Starting subscription expiry notification process...');
        $this->info('Current time: ' . Carbon::now()->toDateTimeString());
        
        $notificationCount = 0;

        foreach ($intervals as $daysLeft => $notificationField) {
            $this->processInterval($daysLeft, $notificationField, $notificationCount);
        }

        $this->info("Process completed. Total notifications queued: {$notificationCount}");
        
        // Log the summary
        Log::info('Subscription expiry notifications queued', [
            'total_sent' => $notificationCount,
            'date' => Carbon::now()->toDateTimeString(),
        ]);

        return Command::SUCCESS;
    }

    /**
     * Process subscriptions for a specific interval.
     */
    protected function processInterval(int $daysLeft, string $notificationField, int &$notificationCount): void
    {
        $this->info("\nProcessing {$daysLeft}-day notifications...");

        $targetDate = Carbon::now()->addDays($daysLeft);
        $this->info("Looking for subscriptions expiring on: {$targetDate->toDateString()}");
        
        // Get active subscriptions expiring in exactly $daysLeft days
        $subscriptions = Subscription::query()
            ->where('status', 'active')
            ->whereDate('ends_at', $targetDate->toDateString())
            ->whereNull($notificationField)
            ->with(['user', 'plan'])
            ->get();

        $this->info("Found {$subscriptions->count()} subscriptions expiring in {$daysLeft} days");

        foreach ($subscriptions as $subscription) {
            try {
                if (!$this->option('dry-run')) {
                    // Queue the notification
                    $subscription->user->notify(new SubscriptionExpiringNotification($subscription, $daysLeft));
                    
                    // Update the notification timestamp immediately to prevent duplicates
                    $subscription->update([$notificationField => Carbon::now()]);
                    
                    $notificationCount++;
                }
                
                $this->info("✓ Notification queued for {$subscription->user->email} ({$daysLeft}-day expiry)");
                
                // Log individual notification
                Log::info('Subscription expiry notification queued', [
                    'user_id' => $subscription->user_id,
                    'subscription_id' => $subscription->id,
                    'days_left' => $daysLeft,
                    'email' => $subscription->user->email,
                ]);

            } catch (\Exception $e) {
                $this->error("✗ Failed to queue notification for {$subscription->user->email}");
                $this->error("  Error: {$e->getMessage()}");
                
                Log::error('Failed to queue subscription expiry notification', [
                    'user_id' => $subscription->user_id,
                    'subscription_id' => $subscription->id,
                    'days_left' => $daysLeft,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        }
    }
}