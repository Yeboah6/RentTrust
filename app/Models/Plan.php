<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = [
        'name', 'slug', 'price', 'currency', 'interval',
        'listing_limit', 'boost_limit', 'lead_limit',
        'verified_badge', 'priority_ranking', 'analytics_access',
        'paystack_plan_code', 'flutterwave_plan_id',
        'is_active', 'sort_order',
    ];

    protected $casts = [
        'price'            => 'decimal:2',
        'verified_badge'   => 'boolean',
        'priority_ranking' => 'boolean',
        'analytics_access' => 'boolean',
        'is_active'        => 'boolean',
        'listing_limit'    => 'integer',
        'boost_limit'      => 'integer',
        'lead_limit'       => 'integer',
    ];

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function isFree(): bool
    {
        return $this->price == 0;
    }

    public function getFormattedPriceAttribute(): string
    {
        if ($this->isFree()) {
            return 'Free';
        }

        return 'GHS ' . number_format($this->price, 2) . '/mo';
    }

    public function getListingLimitDisplayAttribute(): string
    {
        return is_null($this->listing_limit) ? 'Unlimited' : (string) $this->listing_limit;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}