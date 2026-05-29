<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;
use App\Models\Review;
use App\Traits\GeneratesUUIDs;

class Rental extends Model
{
    use GeneratesUUIDs;
    protected $fillable = [
        'user_id',
        'rental_id',
        'title',
        'slug',
        'property_type',
        'purpose',
        'city',
        'area',
        'address',
        'rent_min',
        'rent_max',
        'sale_price',
        'advance_duration',
        'bedrooms',
        'bathrooms',
        'amenities',
        'description',
        'images',
        'agent_name',
        'agent_phone',
        'agent_email',
        'status',
        'is_verified',
        'is_featured',
        'featured_at',
        'featured_expires_at',
        'is_boosted',
        'boost_expires_at',
        'featured_priority',
        'is_sold',
        'sold_at',
        'verification_status',
        'verification_requested_at',
        'verified_at',
        'verification_rejected_at',
        'verification_rejection_reason',
    ];

    protected $casts = [
        'images' => 'array',
        'amenities' => 'array',
        'rent_min' => 'decimal:2',
        'rent_max' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'bedrooms' => 'integer',
        'bathrooms' => 'integer',
        'advance_duration' => 'integer',
        'is_verified' => 'boolean',
        'is_featured' => 'boolean',
        'featured_at' => 'datetime',
        'featured_expires_at' => 'datetime',
        'is_boosted' => 'boolean',
        'boost_expires_at' => 'datetime',
        'featured_priority' => 'integer',
        'is_sold' => 'boolean',
        'sold_at' => 'datetime',
        'verification_requested_at' => 'datetime',
        'verified_at' => 'datetime',
        'verification_rejected_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
 
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function views()
    {
        return $this->hasMany(ListingView::class);
    }

    public function inquiries()
    {
        return $this->hasMany(ListingInquiry::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function verificationRequests()
    {
        return $this->hasMany(VerificationRequest::class);
    }

    protected static function booted()
    {
        static::creating(function (self $rental) {
            if (empty($rental->slug)) {
                $rental->slug = self::generateUniqueSlug($rental->title, $rental->city, $rental->area);
            }
        });

        static::updating(function (self $rental) {
            if ($rental->isDirty(['title', 'city', 'area']) || empty($rental->slug)) {
                $rental->slug = self::generateUniqueSlug($rental->title, $rental->city, $rental->area, $rental->id);
            }
        });
    }

    public static function generateUniqueSlug(string $title, ?string $city, ?string $area, ?int $ignoreId = null): string
    {
        $base = Str::slug(trim("{$title} {$area} {$city}"));
        $slug = $base ?: Str::slug($title ?: 'property');
        $count = 0;

        while (self::where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->exists()) {
            $count++;
            $slug = Str::limit($base, 65, '') . '-' . $count;
        }

        return $slug;
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Check if this is a rental listing
     */
    public function scopeRentals($query) {
        return $query->where('purpose', 'rent');
    }
    
    public function scopeSales($query) {
        return $query->where('purpose', 'sale');
    }

    public function isRental(): bool
    {
        return $this->purpose === 'rent';
    }

    /**
     * Check if this is a sale listing
     */
    public function isSale(): bool
    {
        return $this->purpose === 'sale';
    }

    /**
     * Check if listing is active
     */
    public function isActive(): bool
    {
        return $this->status === 'approved' && !$this->is_sold;
    }

    /**
     * Get days on market for sale listings
     */
    public function getDaysOnMarket(): ?int
    {
        if (!$this->isSale()) {
            return null;
        }
        return now()->diffInDays($this->created_at);
    }

    /**
     * Scope for active boost
     */
    public function scopeActiveBoost($query)
    {
        return $query->where('is_boosted', true)
                     ->where('boost_expires_at', '>', now());
    }

    /**
     * Check if boost is active
     */
    public function isBoostActive(): bool
    {
        return $this->is_boosted && $this->boost_expires_at && $this->boost_expires_at->isFuture();
    }

    /**
     * Get user's plan priority
     */
    public function getPlanPriority(): int
    {
        $planSlug = strtolower($this->user->subscription?->plan?->slug ?? 'free');
        
        return match($planSlug) {
            'elite' => 3,
            'pro' => 2,
            default => 1, // free
        };
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
    
    public function scopeOrderByPriority($query)
    {
        return $query
            ->orderByDesc('featured_priority')
            ->orderByDesc('featured_at')
            ->orderByDesc('created_at');
    }
}
