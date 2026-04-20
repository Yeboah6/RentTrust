<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\GeneratesUUIDs;

class PasswordResetToken extends Model
{
    use GeneratesUUIDs;
    protected $table = 'password_reset_tokens';
    public $timestamps = false;

    protected $fillable = [
        'email',
        'token',
        'token_id',
        'userType'
    ];
}
