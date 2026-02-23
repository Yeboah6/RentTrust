<?php
// app/Models/Subscription.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plan_type',
        'price',
        'billing_cycle',
        'status',
        'provider',
        'provider_subscription_id',
        'authorization_code',
        'card_type',
        'last_four',
        'next_billing_date',
        'failed_attempts',
        'last_payment_attempt',
        'starts_at',
        'ends_at',
        'trial_ends_at'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'next_billing_date' => 'datetime',
        'last_payment_attempt' => 'datetime',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'trial_ends_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payments()
    {
        return $this->morphMany(Payment::class, 'payable');
    }

    public function isActive()
    {
        return $this->status === 'active' && 
               (!$this->ends_at || $this->ends_at->isFuture());
    }

    public function needsRenewal()
    {
        return $this->status === 'active' && 
               $this->next_billing_date && 
               $this->next_billing_date->isPast() &&
               $this->failed_attempts < 3;
    }
}