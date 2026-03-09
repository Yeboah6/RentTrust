<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class FeatureFlagController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:super_admin']);
    }

    public function index()
    {
        // in a real app flags would be stored in db/config/cache
        $flags = [
            'enable_sales' => Cache::get('enable_sales', true),
            'enable_boosts' => Cache::get('enable_boosts', true),
            'enable_analytics' => Cache::get('enable_analytics', true),
            'enable_featured_listings' => Cache::get('enable_featured_listings', true),
        ];

        return inertia('SuperAdmin/Features/Index', ['flags' => $flags]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'enable_sales' => 'boolean',
            'enable_boosts' => 'boolean',
            'enable_analytics' => 'boolean',
            'enable_featured_listings' => 'boolean',
        ]);

        foreach ($data as $key => $val) {
            Cache::put($key, $val, now()->addYear());
        }

        return back()->with('success', 'Feature flags updated');
    }
}
