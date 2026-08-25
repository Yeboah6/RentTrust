<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class VerificationEvent extends Model
{
    use HasFactory;

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
        'user_agent',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    protected static function booted(): void
    {
        static::creating(function (VerificationEvent $event) {
            $event->event_id ??= (string) Str::uuid();
        });
    }

    public function agentVerification()
    {
        return $this->belongsTo(AgentVerification::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Convenience factory so callers don't have to repeat boilerplate
     * (request IP/user agent) at every call site.
     */
    public static function log(
        int $agentVerificationId,
        ?int $userId,
        string $event,
        ?string $oldStatus = null,
        ?string $newStatus = null,
        ?string $provider = null,
        ?string $providerReference = null,
        array $metadata = [],
        string $source = 'system'
    ): self {
        return static::create([
            'agent_verification_id' => $agentVerificationId,
            'user_id' => $userId,
            'event' => $event,
            'source' => $source,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'provider' => $provider,
            'provider_reference' => $providerReference,
            'metadata' => $metadata,
            'ip_address' => request()?->ip(),
            'user_agent' => request()?->userAgent(),
        ]);
    }
}