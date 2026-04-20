<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\GeneratesUUIDs;

class ListingView extends Model
{
    use GeneratesUUIDs;
    protected $fillable = [
        'rental_id',
        'listing_view_id',
        'user_id',
        'ip',
        'user_agent',
        'referrer',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the rental (listing) associated with this view.
     */
    public function rental(): BelongsTo
    {
        return $this->belongsTo(Rental::class);
    }

    /**
     * Get the user who viewed the listing (if authenticated).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getRouteKeyName()
    {
        return 'listing_view_id';
    }

    /**
     * Check if a view already exists for this rental, IP, and time window.
     */
    public static function hasViewInWindow(int $rentalId, ?string $ip, int $windowHours = 24): bool
    {
        if (!$ip) {
            return false;
        }

        return self::where('rental_id', $rentalId)
            ->where('ip', $ip)
            ->where('created_at', '>=', now()->subHours($windowHours))
            ->exists();
    }
}
