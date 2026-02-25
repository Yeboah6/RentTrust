<?php

namespace App\Console\Commands;

use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ExpireSubscriptions extends Command
{
    protected $signature   = 'subscriptions:expire';
    protected $description = 'Expire subscriptions past their grace period and downgrade to Free';

    public function handle(): void
    {
        $freePlan = Plan::where('slug', 'free')->first();

        if (! $freePlan) {
            $this->error('Free plan not found in database.');
            return;
        }

        // Find all subscriptions past grace period
        $expired = Subscription::where('status', 'active')
            ->whereNotNull('grace_ends_at')
            ->where('grace_ends_at', '<', now())
            ->get();

        foreach ($expired as $subscription) {
            $subscription->update([
                'status'  => 'expired',
                'plan_id' => $freePlan->id, // Downgrade to free
            ]);

            Log::info('Subscription expired and downgraded', [
                'user_id'         => $subscription->user_id,
                'subscription_id' => $subscription->id,
            ]);
        }

        $this->info("Expired {$expired->count()} subscriptions.");
    }
}