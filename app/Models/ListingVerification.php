<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingVerification extends Model
{
    public $fillable = [
        'listing_id',
        'user_id',
        'property_title',
        'property_address',
        'ownership_documents',
        'photos',
        'availability_status',
        'status',
        'other_documents',
        'submitted_at',
        'notes',
        'admin_notes',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'ownership_documents' => 'array',
        'photos' => 'array',
        'other_documents' => 'array',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    public function listing()
    {
        return $this->belongsTo(Listing::class, 'listing_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
