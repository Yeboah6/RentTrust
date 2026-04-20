<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\GeneratesUUIDs;

class Review extends Model
{
    use GeneratesUUIDs;
    protected $fillable = [
        'review_type',
        'rental_id',
        'review_id',
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

    public function rental()
    {
        return $this->belongsTo(Rental::class);
    }

    public function getRouteKeyName()
    {
        return 'review_id';
    }
}
