<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'rental_id',
        'report_type',
        'report_description',
        'evidence',
        'full_name',
        'status'
    ];
}
