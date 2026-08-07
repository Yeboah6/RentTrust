<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use App\Traits\GeneratesUUIDs;

class AdminAuditLog extends Model
{
    use GeneratesUUIDs;
    public    $timestamps  = true;
    public    const UPDATED_AT = null;

    protected $table = 'admin_audit_logs';

    protected $fillable = [
        'admin_audit_log_id',
        'causer_id',        
        'causer_name',      
        'causer_email',     
        'action',           
        'type',             
        'affected_user',    
        'affected_id',      
        'notes',            
        'ip_address',
        'properties',       
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    // ─── Allowed type values ──────────────────────────────────────────────────

    public const TYPES = [
        'payment',
        'refund',
        'subscription',
        'suspension',
        'listing',
        'verification',
        'report',
        'user',
        'settings',
        'security',
    ];

    // ─── Relations ────────────────────────────────────────────────────────────

    public function getRouteKeyName()
    {
        return 'admin_audit_log_id';
    }

    public function causer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'causer_id');
    }

    public static function record(
        string $type,
        string $action,
        array  $context = []
    ): self {
        return static::create([
            'admin_audit_log_id' => static::generateUUID(),
            'causer_id'     => $context['causer_id']    ?? Auth::id(),
            'causer_name'   => $context['causer_name']  ?? Auth::user()?->name   ?? 'System',
            'causer_email'  => $context['causer_email'] ?? Auth::user()?->email  ?? '',
            'action'        => $action,
            'type'          => in_array($type, self::TYPES) ? $type : 'settings',
            'affected_user' => $context['affected_user'] ?? '—',
            'affected_id'   => $context['affected_id']   ?? null,
            'notes'         => $context['notes']          ?? '',
            'ip_address'    => $context['ip']             ?? Request::ip(),
            'properties'    => $context['properties']     ?? null,
        ]);
    }

    protected static function booted()
    {
        static::creating(function (AdminAuditLog $log) {
            $log->admin_audit_log_id ??= (string) Str::uuid();
            $log->created_at ??= now();
        });
    }
}