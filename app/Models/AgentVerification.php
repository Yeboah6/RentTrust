<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgentVerification extends Model
{
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
    ];

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function identityVerifications()
    {
        return $this->hasMany(IdentityVerification::class);
    }

    public function events()
    {
        return $this->hasMany(VerificationEvent::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(
            User::class,
            'reviewed_by'
        );
    }
    
}
