<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ExpireSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expire subscriptions past their grace period and downgrade to Free';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting subscription expiration process...');
        
        $now = Carbon::now();
        $expiredCount = 0;
        
        // Find active subscriptions past their grace period
        $subscriptions = Subscription::query()
            ->where('status', 'active')
            ->whereNotNull('grace_ends_at')
            ->where('grace_ends_at', '<', $now)
            ->with(['user', 'plan'])
            ->get();
        
        $this->info("Found {$subscriptions->count()} subscriptions past grace period");
        
        foreach ($subscriptions as $subscription) {
            try {
                // Update subscription status to expired
                $subscription->update([
                    'status' => 'expired',
                ]);
                
                // Optionally downgrade user to free package
                if ($subscription->user) {
                    $subscription->user->update([
                        'package' => 'free',
                    ]);
                }
                
                $expiredCount++;
                
                $this->info("✓ Expired subscription #{$subscription->id} for {$subscription->user->email}");
                
                Log::info('Subscription expired', [
                    'subscription_id' => $subscription->id,
                    'user_id' => $subscription->user_id,
                    'plan_name' => $subscription->plan->name ?? 'Unknown',
                    'expired_at' => $now->toDateTimeString(),
                ]);
                
            } catch (\Exception $e) {
                $this->error("✗ Failed to expire subscription #{$subscription->id}");
                $this->error("  Error: {$e->getMessage()}");
                
                Log::error('Failed to expire subscription', [
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        }
        
        // Also check for subscriptions past their end date but still active
        $pastDue = Subscription::query()
            ->where('status', 'active')
            ->whereNotNull('ends_at')
            ->where('ends_at', '<', $now)
            ->whereNull('grace_ends_at')
            ->with(['user'])
            ->get();
        
        if ($pastDue->isNotEmpty()) {
            $this->info("Found {$pastDue->count()} additional subscriptions past end date without grace period");
            
            foreach ($pastDue as $subscription) {
                try {
                    $subscription->update([
                        'status' => 'expired',
                    ]);
                    
                    if ($subscription->user) {
                        $subscription->user->update([
                            'package' => 'free',
                        ]);
                    }
                    
                    $expiredCount++;
                    
                    $this->info("✓ Expired subscription #{$subscription->id} for {$subscription->user->email}");
                    
                } catch (\Exception $e) {
                    $this->error("✗ Failed to expire subscription #{$subscription->id}: {$e->getMessage()}");
                }
            }
        }
        
        $this->info("Process completed. Total subscriptions expired: {$expiredCount}");
        
        Log::info('Subscription expiration process completed', [
            'total_expired' => $expiredCount,
            'timestamp' => $now->toDateTimeString(),
        ]);
        
        return Command::SUCCESS;
    }
}