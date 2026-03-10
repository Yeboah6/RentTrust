<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'user_id', 'subscription_id', 'reference',
        'provider', 'amount', 'currency',
        'status', 'failure_reason', 'raw_payload',
    ];

    protected $casts = [
        'amount'      => 'decimal:2',
        'raw_payload' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    /**
     * Some payments reference a plan directly (e.g. one-off plan purchases).
     * Controller was eager-loading "plan", so add the relationship here.
     */
    public function plan(): BelongsTo
    {
        // avoid a circular import if Plan lives elsewhere
        return $this->belongsTo(\App\Models\Plan::class);
    }
}