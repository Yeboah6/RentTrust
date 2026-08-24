<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VerificationConsent extends Model
{
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
        'withdrawn_at'
    ];

    protected $casts = [
        'accepted' => 'boolean',
        'accepted_at' => 'datetime',
        'withdrawn_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function agentVerification()
    {
        return $this->belongsTo(AgentVerification::class);
    }
}
