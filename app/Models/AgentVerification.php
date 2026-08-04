<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgentVerification extends Model
{
    protected $fillable = [
        'agent_id',
        'agent_name',
        'email',
        'phone_number',
        'gov_id',
        'license_documents',
        'proof_of_address',
        'notes',
        'admin_notes',
        'status',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }
    
}
