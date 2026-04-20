<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\GeneratesUUIDs;

class VerificationRequest extends Model
{
    use HasFactory, GeneratesUUIDs;

    protected $fillable = [
        'rental_id',
        'verification_request_id',
        'agent_id',
        'agent_name',
        'request_type',
        'status',
        'proof_documents',
        'ownership_documents',
        'license_documents',
        'utility_bills',
        'additional_notes',
        'admin_notes',
        'rejection_reason',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    /**
     * Get the rental associated with this verification request
     */
    public function rental()
    {
        return $this->belongsTo(Rental::class);
    }

    /**
     * Get the agent who submitted the request
     */
    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function getRouteKeyName()
    {
        return 'verification_request_id';
    }

    /**
     * Get the user who submitted the request (if different from agent)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the admin who reviewed the request
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Scope to get pending requests
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to get approved requests
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope to get rejected requests
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Get all documents as array
     */
    public function getAllDocuments()
    {
        return [
            'proof_documents' => json_decode($this->proof_documents, true) ?? [],
            'ownership_documents' => json_decode($this->ownership_documents, true) ?? [],
            'license_documents' => json_decode($this->license_documents, true) ?? [],
            'utility_bills' => json_decode($this->utility_bills, true) ?? [],
        ];
    }

    /**
     * Get total document count
     */
    public function getTotalDocumentsAttribute()
    {
        $docs = $this->getAllDocuments();
        return array_sum(array_map('count', $docs));
    }
}