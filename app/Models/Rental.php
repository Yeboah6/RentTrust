<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;
use App\Models\Review;
use App\Models\User;
// use App\Models\VerificationRequest;
use App\Traits\GeneratesUUIDs;

class Rental extends Model
{
    use GeneratesUUIDs;
    protected $fillable = [
        'user_id',
        'agent_id',
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
        'is_sold',
        'is_rented',
        'sold_at',
        'rented_at',
        'verification_status',
        'verification_requested_at',
        'verified_at',
        'verification_rejected_at',
        'verification_rejection_reason',
    ];

    protected $casts = [
        'images' => 'array',
        'amenities' => 'array',
        'agent_id' => 'integer',
        'rent_min' => 'decimal:2',
        'rent_max' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'bedrooms' => 'integer',
        'bathrooms' => 'integer',
        'advance_duration' => 'integer',
        'is_verified' => 'boolean',
        'is_sold' => 'boolean',
        'is_rented' => 'boolean',
        'sold_at' => 'datetime',
        'rented_at' => 'datetime',
        'verification_requested_at' => 'datetime',
        'verified_at' => 'datetime',
        'verification_rejected_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
 
    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
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

    // public function verificationRequests()
    // {
    //     return $this->hasMany(VerificationRequest::class);
    // }

    public function scopeOrderByAvailability($query)
    {
        return $query->orderByRaw("
            CASE status
                WHEN 'active' THEN 0
                WHEN 'rented' THEN 1
                WHEN 'inactive' THEN 2
                WHEN 'sold' THEN 3
                ELSE 4
            END
        ");
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

    public function resolveRouteBinding($value, $field = null)
    {
        $field = $field ?: $this->getRouteKeyName();

        $query = $this->where($field, $value);

        if (! $query->exists() && is_numeric($value)) {
            return $this->where('id', $value)->first();
        }

        return $query->first();
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
        return $this->status === 'active' && !$this->is_sold;
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
     * Get user's plan priority
     */
    public function getPlanPriority(): int
    {
        $planSlug = strtolower($this->user->subscription?->plan?->slug ?? 'free');
        
        return match($planSlug) {
            'elite' => 3,
            'pro' => 2,
            default => 1,
        };
    }
}
