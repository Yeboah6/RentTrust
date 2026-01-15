<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    protected $fillable = [
        'agentId',
        'title',
        'propertyType',
        'city',
        'area',
        'address',
        'monthlyRent',
        'advanceDuration',
        'bedrooms',
        'bathrooms',
        'agentName',
        'agentPhone',
        'agentEmail',
        'amenities',
        'description',
        'images',
    ];

    protected $casts = [
        'amenities' => 'array',
        'images' => 'array',
    ];
}
