<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Agent extends Authenticatable
{
    protected $fillable = [
        'fullName',
        'phone',
        'email',
        'company',
        'type',
        'fee',
        'bio',
        'password',
    ];

    protected $hidden = [
        'password',
    ];
}
