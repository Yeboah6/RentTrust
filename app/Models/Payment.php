<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'transaction_id',
        'user_id',
        'payable_type',
        'payable_id',
        'provider',
        'payment_method',
        'phone_number',
        'amount',
        'currency',
        'status',
        'metadata',
        'provider_response',
        'verification_response',
        'paid_at',
        'expires_at'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'metadata' => 'array',
        'provider_response' => 'array',
        'verification_response' => 'array',
        'paid_at' => 'datetime',
        'expires_at' => 'datetime'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($payment) {
            if (empty($payment->reference)) {
                $payment->reference = static::generateReference();
            }
            if (empty($payment->expires_at)) {
                $payment->expires_at = now()->addMinutes(30);
            }
        });
    }

    public static function generateReference()
    {
        $prefix = 'RENT';
        $timestamp = now()->format('ymdHis');
        $random = strtoupper(substr(uniqid(), -6));
        
        return "{$prefix}{$timestamp}{$random}";
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payable()
    {
        return $this->morphTo();
    }

    public function attempts()
    {
        return $this->hasMany(PaymentAttempt::class);
    }

    public function markAsSuccess($transactionId, $providerResponse = null)
    {
        $this->update([
            'transaction_id' => $transactionId,
            'status' => 'success',
            'provider_response' => $providerResponse,
            'paid_at' => now()
        ]);
    }

    public function markAsFailed($error = null)
    {
        $this->update([
            'status' => 'failed',
            'metadata' => array_merge($this->metadata ?? [], ['error' => $error])
        ]);
    }

    public function isExpired()
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending')
                     ->where('expires_at', '>', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'pending')
                     ->where('expires_at', '<=', now());
    }

    public function scopeSuccessful($query)
    {
        return $query->where('status', 'success');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByProvider($query, $provider)
    {
        return $query->where('provider', $provider);
    }

    public function scopeByMethod($query, $method)
    {
        return $query->where('payment_method', $method);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('created_at', now()->month)
                     ->whereYear('created_at', now()->year);
    }
}