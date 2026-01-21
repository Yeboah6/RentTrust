<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
    'rental_id',
    'overall_rating',
    'landlord_responsive',
    'property_matched_description',
    'fair_pricing',
    'good_communication',
    'comments',
    'full_name',
    'response',
    'response_name'
];


    protected $cast = [
        'overall_rating'=>'array',
    ];
}
