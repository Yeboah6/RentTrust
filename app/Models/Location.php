<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\GeneratesUUIDs;

class Location extends Model
{
    use HasFactory, GeneratesUUIDs;

    protected $fillable = [
        'name', 
        'slug',
        'location_id',
        'type',
        'is_active',
        'parent_id'
    ];

    public function parent()
    {
        return $this->belongsTo(Location::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Location::class, 'parent_id');
    }

    public function getRouteKeyName()
    {
        return 'location_id';
    }
}
