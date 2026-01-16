<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RentalImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'rental_id',
        'image_path',
        'image_url',
        'is_primary',
        'display_order'
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'display_order' => 'integer',
    ];

    public function rental()
    {
        return $this->belongsTo(Rental::class);
    }
}