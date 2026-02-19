<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_id',
        'user_id',
        'reference',
        'provider',
        'status',
        'error_message',
        'request_data',
        'response_data',
        'ip_address',
        'user_agent'
    ];

    protected $casts = [
        'request_data' => 'array',
        'response_data' => 'array'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($attempt) {
            $attempt->ip_address = request()->ip();
            $attempt->user_agent = request()->userAgent();
        });
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function markAsSuccess($responseData = null)
    {
        $this->update([
            'status' => 'success',
            'response_data' => $responseData
        ]);
    }

    public function markAsFailed($errorMessage, $responseData = null)
    {
        $this->update([
            'status' => 'failed',
            'error_message' => $errorMessage,
            'response_data' => $responseData
        ]);
    }
}