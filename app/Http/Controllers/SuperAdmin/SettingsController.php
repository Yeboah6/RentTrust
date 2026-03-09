<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class SettingsController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:super_admin']);
    }

    public function index()
    {
        // for simplicity, just retrieve a subset of settings
        $settings = [
            'platform_name' => Config::get('app.name'),
            'support_email' => Config::get('mail.from.address'),
            'default_currency' => Config::get('payment.default_currency', 'GHS'),
            'listing_approval_required' => Config::get('app.listing_approval_required', true),
            'maintenance_mode' => Config::get('app.maintenance_mode', false),
        ];

        return inertia('SuperAdmin/Settings/Index', ['settings' => $settings]);
    }

    public function update(Request $request)
    {
        // you would normally write to a database table or config store
        // here we'll just pretend and redirect back
        $data = $request->validate([
            'platform_name' => 'nullable|string',
            'support_email' => 'nullable|email',
            'default_currency' => 'nullable|string',
            'listing_approval_required' => 'boolean',
            'maintenance_mode' => 'boolean',
        ]);

        // update the actual config or database

        return back()->with('success', 'Settings saved');
    }
}
