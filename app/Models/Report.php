<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\GeneratesUUIDs;

class Report extends Model
{
    use GeneratesUUIDs;
    protected $fillable = [
        'rental_id',
        'report_id',
        'report_type',
        'report_description',
        'evidence',
        'full_name',
        'status'
    ];

    protected $casts = [
        'evidence' => 'array',
    ];

    public function rental()
    {
        return $this->belongsTo(Rental::class);
    }

    public function getRouteKeyName()
    {
        return 'report_id';
    }
}
