<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\GeneratesUUIDs;

class Subscription extends Model
{
    use GeneratesUUIDs;
    protected $fillable = [
        'user_id', 
        'plan_id', 
        'provider',
        'subscription_uuid',
        'provider_subscription_id', 
        'provider_customer_code',
        'status', 
        'starts_at', 
        'ends_at', 
        'grace_ends_at',
        'retry_count', 
        'last_retry_at', 
        'meta',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->subscription_uuid)) {
                $model->subscription_uuid = static::generateUUID();
            }
        });
    }

    protected $casts = [
        'starts_at'      => 'datetime',
        'ends_at'        => 'datetime',
        'grace_ends_at'  => 'datetime',
        'last_retry_at'  => 'datetime',
        'meta'           => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && ! $this->isExpired();
    }

    public function isExpired(): bool
    {
        if (is_null($this->ends_at)) {
            return false;
        }

        // Allow grace period
        if ($this->grace_ends_at && $this->grace_ends_at->isFuture()) {
            return false;
        }

        return $this->ends_at->isPast();
    }

    public function getRouteKeyName()
    {
        return 'subscription_uuid';
    }

    public function inGracePeriod(): bool
    {
        return $this->ends_at?->isPast()
            && $this->grace_ends_at?->isFuture();
    }

    public function daysUntilExpiry(): int
    {
        return max(0, (int) now()->diffInDays($this->ends_at, false));
    }
}