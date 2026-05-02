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
     * Check if a view already exists for this rental, IP, user, and time window.
     * Tracks by IP + User combination to allow multiple users from same network
     * while preventing duplicates from the same user/IP pair.
     */
    public static function hasViewInWindow(int $rentalId, ?string $ip, ?int $userId = null, int $windowHours = 24): bool
    {
        if (!$ip) {
            return false;
        }

        $query = self::where('rental_id', $rentalId)
            ->where('ip', $ip)
            ->where('created_at', '>=', now()->subHours($windowHours));
        
        // If user is authenticated, check by IP + User combination
        // If not authenticated, check by IP alone
        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->exists();
    }
}
