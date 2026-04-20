<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    public $timestamps = true;

    public function getValueAttribute($value)
    {
        $decoded = json_decode($value, true);
        return json_last_error() === JSON_ERROR_NONE ? $decoded : $value;
    }

    public function setValueAttribute($value)
    {
        $this->attributes['value'] = is_string($value)
            ? json_encode($value)
            : json_encode($value);
    }
}
