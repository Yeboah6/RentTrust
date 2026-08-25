<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class AgentVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'verification_id',
        'user_id',
        'status',
        'identity_status',
        'identity_verified_at',
        'professional_status',
        'professional_verified_at',
        'verified_at',
        'expires_at',
        'reviewed_by',
        'reviewed_at',
        'review_notes',
        'rejection_reason',
        'risk_level',
        'risk_score',
        'requires_manual_review',
    ];

    protected $casts = [
        'identity_verified_at' => 'datetime',
        'professional_verified_at' => 'datetime',
        'verified_at' => 'datetime',
        'expires_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'risk_score' => 'integer',
        'requires_manual_review' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (AgentVerification $verification) {
            $verification->verification_id ??= (string) Str::uuid();
        });
    }

    // ---------- Relationships ----------

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function identityVerifications()
    {
        return $this->hasMany(IdentityVerification::class);
    }

    public function latestIdentityVerification()
    {
        return $this->hasOne(IdentityVerification::class)->latestOfMany();
    }

    public function consents()
    {
        return $this->hasMany(VerificationConsent::class);
    }

    public function events()
    {
        return $this->hasMany(VerificationEvent::class);
    }

    // ---------- Helpers ----------

    public function isLocked(): bool
    {
        return in_array($this->status, ['pending', 'approved'], true);
    }
}