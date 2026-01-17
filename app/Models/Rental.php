<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    protected $fillable = [
        'agent_id',
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
        'agent_name',
        'agent_phone',
        'agent_email',
        'status',
        'is_verified',
        'is_claimed',
    ];

    protected $casts = [
        'amenities' => 'array',
        'rent_min' => 'decimal:2',
        'rent_max' => 'decimal:2',
        'bedrooms' => 'integer',
        'bathrooms' => 'integer',
        'advance_duration' => 'integer',
        'is_verified' => 'boolean',
        'is_claimed' => 'boolean',
    ];

    protected $with = ['agent'];

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }

    public function images()
    {
        return $this->hasMany(RentalImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(RentalImage::class)->where('is_primary', true);
    }

    protected function amenities(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => json_decode($value, true) ?? [],
            set: fn ($value) => is_array($value) ? json_encode($value) : $value,
        );
    }
}
