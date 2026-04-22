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
    public    const UPDATED_AT = null;          // audit records are immutable

    protected $table       = 'admin_audit_logs';

    protected $fillable = [
        'admin_audit_log_id',
        'causer_id',        // admin user id
        'causer_name',      // snapshot of admin name at log time
        'causer_email',     // snapshot of admin email at log time
        'action',           // human label: "Subscription cancelled", "User suspended"…
        'type',             // payment | refund | subscription | suspension | listing | verification | report | user | settings | security
        'affected_user',    // display name of the entity acted upon
        'affected_id',      // numeric id of the affected entity (user_id, listing_id…)
        'notes',            // free-text context
        'ip_address',
        'properties',       // JSON blob for extra structured data
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

    // ─── Factory helper ───────────────────────────────────────────────────────

    /**
     * Write an audit entry from anywhere in the application.
     *
     * Usage:
     *   AdminAuditLog::record('subscription', 'Subscription cancelled', [
     *       'affected_user' => $user->name,
     *       'affected_id'   => $user->id,
     *       'notes'         => 'Admin-initiated cancellation.',
     *       'properties'    => ['plan' => 'pro', 'refunded' => false],
     *   ]);
     */
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
}