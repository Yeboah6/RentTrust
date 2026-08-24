<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgentLicense extends Model
{
    protected $table = 'agent_licenses';

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
        'verification_notes'
    ];

    protected $casts = [
        'issued_at' => 'date:Y-m-d',
        'expires_at' => 'date:Y-m-d',
        'is_verified' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
