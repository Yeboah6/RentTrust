<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class SettingsController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:super_admin']);
    }

    private function defaultSettings(): array
    {
        return [
            'platform_name' => Config::get('app.name'),
            'support_email' => Config::get('mail.from.address'),
            'support_phone' => Config::get('app.support_phone', ''),
            'default_currency' => Config::get('payment.default_currency', 'GHS'),
            'default_language' => Config::get('app.locale', 'en'),
            'guest_inquiry_enabled' => Config::get('app.guest_inquiry_enabled', true),
            'listing_approval_required' => Config::get('app.listing_approval_required', true),
            'maintenance_mode' => Config::get('app.maintenance_mode', false),
        ];
    }

    public function index()
    {
        $defaults = $this->defaultSettings();
        $stored = SystemSetting::whereIn('key', array_keys($defaults))
            ->pluck('value', 'key')
            ->map(function ($value) {
                $decoded = json_decode($value, true);
                return json_last_error() === JSON_ERROR_NONE ? $decoded : $value;
            })
            ->toArray();

        $settings = array_merge($defaults, $stored);

        return inertia('SuperAdmin/Settings/Index', ['settings' => $settings]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'platform_name' => 'nullable|string',
            'support_email' => 'nullable|email',
            'support_phone' => 'nullable|string',
            'default_currency' => 'nullable|string',
            'default_language' => 'nullable|string',
            'guest_inquiry_enabled' => 'boolean',
            'listing_approval_required' => 'boolean',
            'maintenance_mode' => 'boolean',
        ]);

        foreach ($data as $key => $value) {
            SystemSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        AdminAuditLog::record('settings', 'Platform settings updated', [
            'affected_user' => auth()->user()?->name ?? 'Super Admin',
            'affected_id'   => auth()->id(),
            'notes'         => 'Platform settings were updated via the Super Admin settings page.',
            'properties'    => $data,
        ]);

        return back()->with('success', 'Settings saved');
    }
}
