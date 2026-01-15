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
        // 'is_active',
    ];

    protected $casts = [
        'amenities' => 'array',
        'rent_min' => 'decimal:2',
        'rent_max' => 'decimal:2',
        // 'is_active' => 'boolean',
        'advance_duration' => 'integer',
        'bedrooms' => 'integer',
        'bathrooms' => 'integer',
    ];

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
}
