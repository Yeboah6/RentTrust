<?php

namespace App\Services;

use App\Models\Subscription;
use App\Notifications\SubscriptionExpiringNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SubscriptionNotificationService
{
    protected $intervals = [
        15 => 'notified_15_day_at',
        7 => 'notified_7_day_at',
        1 => 'notified_1_day_at',
    ];

    public function processExpiringSubscriptions()
    {
        $results = [
            'total_sent' => 0,
            'failed' => 0,
            'details' => []
        ];

        foreach ($this->intervals as $daysLeft => $notificationField) {
            $result = $this->processInterval($daysLeft, $notificationField);
            $results['total_sent'] += $result['sent'];
            $results['failed'] += $result['failed'];
            $results['details'][$daysLeft] = $result;
        }

        return $results;
    }

    protected function processInterval(int $daysLeft, string $notificationField)
    {
        $targetDate = Carbon::now()->addDays($daysLeft);
        
        $subscriptions = Subscription::query()
            ->where('status', 'active')
            ->whereDate('ends_at', $targetDate->toDateString())
            ->whereNull($notificationField)
            ->with(['user', 'plan'])
            ->get();

        $result = [
            'sent' => 0,
            'failed' => 0,
            'subscriptions' => []
        ];

        foreach ($subscriptions as $subscription) {
            try {
                $subscription->user->notify(
                    new SubscriptionExpiringNotification($subscription, $daysLeft)
                );
                
                $subscription->update([$notificationField => Carbon::now()]);
                
                $result['sent']++;
                $result['subscriptions'][] = [
                    'user_id' => $subscription->user_id,
                    'email' => $subscription->user->email,
                    'status' => 'sent'
                ];
            } catch (\Exception $e) {
                $result['failed']++;
                $result['subscriptions'][] = [
                    'user_id' => $subscription->user_id,
                    'email' => $subscription->user->email,
                    'status' => 'failed',
                    'error' => $e->getMessage()
                ];
                
                Log::error('Failed to send subscription notification', [
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $result;
    }
}