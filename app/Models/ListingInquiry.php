<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\GeneratesUUIDs;

class ListingInquiry extends Model
{
    use GeneratesUUIDs;
    protected $fillable = [
        'rental_id',
        'listing_inquiry_id',
        'user_id',
        'type',
        'message',
        'ip',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the rental (listing) associated with this inquiry.
     */
    public function rental(): BelongsTo
    {
        return $this->belongsTo(Rental::class);
    }

    /**
     * Get the user who made the inquiry (if authenticated).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function validTypes(): array
    {
        return ['whatsapp', 'phone', 'form'];
    }

    public function getRouteKeyName()
    {
        return 'listing_inquiry_id';
    }
}
