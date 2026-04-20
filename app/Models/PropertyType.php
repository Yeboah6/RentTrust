<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\GeneratesUUIDs;

class PropertyType extends Model
{
    use HasFactory, GeneratesUUIDs;

    protected $fillable = [
        'name',
        'slug',
        'property_type_id',
        'description',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public function getRouteKeyName()
    {
        return 'property_type_id';
    }
}
