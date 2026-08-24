<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IdentityVerification extends Model
{
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

    protected $cast = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'verified_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function agentVerification()
    {
        return $this->belongsTo(
            AgentVerification::class
        );
    }
}
