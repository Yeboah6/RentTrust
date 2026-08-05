<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\GeneratesUUIDs;

class Amenity extends Model
{
    use HasFactory, GeneratesUUIDs;

    protected $fillable = [
        'name',
        'category',
        'amenity_id',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getRouteKeyName()
    {
        return 'amenity_id';
    }
}
