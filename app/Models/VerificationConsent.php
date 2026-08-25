<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class VerificationConsent extends Model
{
    use HasFactory;

    // Consent type constants used across the identity verification flow.
    public const TYPE_NIA_DATA_SHARE = 'nia_data_share';
    public const TYPE_VERIFICATION_TERMS = 'verification_terms';

    public const CURRENT_DOCUMENT_VERSION = 'v1';

    protected $fillable = [
        'consent_id',
        'user_id',
        'agent_verification_id',
        'consent_type',
        'document_version',
        'accepted',
        'accepted_at',
        'ip_address',
        'user_agent',
        'withdrawn_at',
    ];

    protected $casts = [
        'accepted' => 'boolean',
        'accepted_at' => 'datetime',
        'withdrawn_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (VerificationConsent $consent) {
            $consent->consent_id ??= (string) Str::uuid();
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function agentVerification()
    {
        return $this->belongsTo(AgentVerification::class);
    }
}