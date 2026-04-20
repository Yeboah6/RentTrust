<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\GeneratesUUIDs;

class SubscriptionAuditLog extends Model
{
    use GeneratesUUIDs;
    public $timestamps = true;
    public const UPDATED_AT = null; // audit logs are immutable once written

    protected $fillable = [
        'subscription_id',
        'subscription_audit_log_id',
        'admin_id',
        'action',
        'notes',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    // ─── Action labels ────────────────────────────────────────────────────────

    public const ACTION_LABELS = [
        'cancel'               => 'Cancelled',
        'suspend'              => 'Suspended',
        'free_month'           => 'Free Extension Granted',
        'upgrade'              => 'Plan Upgraded',
        'admin_grant'          => 'Admin Grant',
        'created_via_upgrade'  => 'Created via Upgrade',
        'cancelled_for_grant'  => 'Cancelled (for Grant)',
    ];

    public function getActionLabelAttribute(): string
    {
        return self::ACTION_LABELS[$this->action] ?? ucfirst(str_replace('_', ' ', $this->action));
    }

    // ─── Relations ────────────────────────────────────────────────────────────

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    public function getRouteKeyName()
    {
        return 'subscription_audit_log_id';
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}