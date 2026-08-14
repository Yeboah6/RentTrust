<?php

namespace App\Console\Commands;

use App\Jobs\SendSubscriptionExpiryReminder;
use App\Models\Subscription;
use Illuminate\Console\Command;

class NotifyExpiringSubscriptions extends Command
{
    protected $signature = 'subscriptions:notify-expiring';
    protected $description = 'Notify pro/elite users 15, 7, and 1 day before subscription expiry';

    protected array $milestones = [
        15 => 'notified_15_day_at',
        7  => 'notified_7_day_at',
        1  => 'notified_1_day_at',
    ];

    public function handle(): void
    {
        foreach ($this->milestones as $days => $flagColumn) {
            $subscriptions = Subscription::where('status', 'active')
                ->whereHas('plan', function ($query) {
                    $query->whereIn('slug', ['pro', 'elite']);
                })
                ->whereDate('ends_at', now()->addDays($days)->toDateString())
                ->whereNull($flagColumn)
                ->get();

            foreach ($subscriptions as $subscription) {
                SendSubscriptionExpiryReminder::dispatch($subscription, $days);
                $subscription->update([$flagColumn => now()]);
            }

            $this->info("{$days}-day reminders: {$subscriptions->count()} sent.");
        }
    }
}
