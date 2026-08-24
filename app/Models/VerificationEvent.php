<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VerificationEvent extends Model
{
    protected $fillable = [
        'event_id',
        'agent_verification_id',
        'user_id',
        'event',
        'source',
        'old_status',
        'new_status',
        'provider',
        'provider_reference',
        'metadata',
        'ip_address',
        'user_agent'
    ];

    protected $casts = [
        'metadata' => 'array'
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
