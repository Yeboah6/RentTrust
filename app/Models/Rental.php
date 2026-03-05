<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use App\Models\Review;

class Rental extends Model
{
    protected $fillable = [
        'user_id',
        'title',
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
        'is_claimed',
        'is_sold',
        'sold_at',
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
        'is_claimed' => 'boolean',
        'is_sold' => 'boolean',
        'sold_at' => 'datetime',
    ];

    // protected $with = ['agent'];

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

    protected function amenities(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => json_decode($value, true) ?? [],
            set: fn ($value) => is_array($value) ? json_encode($value) : $value,
        );
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
     * Mark listing as sold
     */
    public function markAsSold(): void
    {
        $this->update([
            'is_sold' => true,
            'sold_at' => now(),
        ]);
    }
}
