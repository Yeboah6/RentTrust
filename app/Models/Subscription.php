<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{

    protected $fillable = [
        'user_id',
        'plan_id',
        'status',
        'billing_cycle',
        'provider_subscription_id',
        'provider',
        'authorization_code',
        'card_type',
        'last_four',
        'next_billing_date',
        'failed_attempts',
        'last_payment_attempt'
    ];

    public function attachProviderSubscription($provider, $providerSubscriptionId, $authorizationData)
    {
        $this->update([
            'provider' => $provider,
            'provider_subscription_id' => $providerSubscriptionId,
            'authorization_code' => $authorizationData['authorization_code'] ?? null,
            'card_type' => $authorizationData['card_type'] ?? null,
            'last_four' => $authorizationData['last_four'] ?? null,
            'next_billing_date' => $this->calculateNextBillingDate(),
            'last_payment_attempt' => now(),
            'failed_attempts' => 0
        ]);
    }

    public function recordSuccessfulRenewal()
    {
        $this->update([
            'next_billing_date' => $this->calculateNextBillingDate(),
            'last_payment_attempt' => now(),
            'failed_attempts' => 0,
            'status' => 'active'
        ]);
    }

    public function recordFailedRenewal($error = null)
    {
        $this->increment('failed_attempts');
        $this->update([
            'last_payment_attempt' => now()
        ]);

        // If failed 3 times, mark as past_due
        if ($this->failed_attempts >= 3) {
            $this->update(['status' => 'past_due']);
        }
    }

    public function calculateNextBillingDate()
    {
        return match($this->billing_cycle) {
            'monthly' => now()->addMonth(),
            'quarterly' => now()->addMonths(3),
            'yearly' => now()->addYear(),
            default => now()->addMonth()
        };
    }

    public function needsRenewal()
    {
        return $this->next_billing_date && 
               $this->next_billing_date->isPast() && 
               $this->status === 'active';
    }

    public function scopeNeedsRenewal($query)
    {
        return $query->where('status', 'active')
                     ->where('next_billing_date', '<=', now())
                     ->where('failed_attempts', '<', 3);
    }

    public function scopePastDue($query)
    {
        return $query->where('status', 'past_due');
    }
}
