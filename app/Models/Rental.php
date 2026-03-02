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
        'city',
        'area',
        'address',
        'rent_min',
        'rent_max',
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
    ];

    protected $casts = [
        'images' => 'array',
        'amenities' => 'array',
        'rent_min' => 'decimal:2',
        'rent_max' => 'decimal:2',
        'bedrooms' => 'integer',
        'bathrooms' => 'integer',
        'advance_duration' => 'integer',
        'is_verified' => 'boolean',
        'is_claimed' => 'boolean',
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
}
