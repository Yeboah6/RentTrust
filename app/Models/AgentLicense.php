<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Professional (e.g. REAC) license record.
 *
 * NOTE: This is not wired into AgentVerificationController yet. The current
 * verification flow only covers identity (Ghana Card + biometric/NIA).
 * agent_verifications.professional_status stays 'not_started' until a
 * license-verification flow is built against this table.
 */
class AgentLicense extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_license_id',
        'user_id',
        'license_number',
        'license_type',
        'issuing_authority',
        'license_holder_name',
        'status',
        'issued_at',
        'expires_at',
        'is_verified',
        'verified_at',
        'verification_method',
        'verified_by',
        'verification_notes',
    ];

    protected $casts = [
        'issued_at' => 'date',
        'expires_at' => 'date',
        'is_verified' => 'boolean',
        'verified_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (AgentLicense $license) {
            $license->agent_license_id ??= (string) Str::uuid();
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}