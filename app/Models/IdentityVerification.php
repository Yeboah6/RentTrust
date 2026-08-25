<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class IdentityVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'identity_verification_id',
        'agent_verification_id',
        'provider',
        'provider_reference',
        'provider_subject_id',
        'national_id_reference',
        'status',
        'biometric_verified',
        'biometric_method',
        'liveness_verified',
        'match_score',
        'verified_first_name',
        'verified_middle_name',
        'verified_last_name',
        'verified_date_of_birth',
        'verified_gender',
        'failure_code',
        'failure_reason',
        'started_at',
        'completed_at',
        'verified_at',
        'expires_at',
    ];

    protected $casts = [
        'biometric_verified' => 'boolean',
        'liveness_verified' => 'boolean',
        'match_score' => 'decimal:2',
        'verified_date_of_birth' => 'date',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'verified_at' => 'datetime',
        'expires_at' => 'datetime',
        // The Ghana Card / national ID reference is sensitive PII — encrypt at rest.
        // Requires the column to be `text`, which it is in the migration.
        'national_id_reference' => 'encrypted',
    ];

    protected static function booted(): void
    {
        static::creating(function (IdentityVerification $verification) {
            $verification->identity_verification_id ??= (string) Str::uuid();
        });
    }

    public function agentVerification()
    {
        return $this->belongsTo(AgentVerification::class);
    }
}