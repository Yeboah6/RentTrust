<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Plan;
use App\Models\AdminAuditLog;

class PlanController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:super_admin']);
    }

    public function index()
    {
        $plans = Plan::all();
        return inertia('SuperAdmin/Plans/Index', ['plans' => $plans]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'               => 'required|string|max:255',
            'description'        => 'required|string',
            'slug'               => 'nullable|string|unique:plans,slug',
            'price'              => 'required|numeric|min:0',
            'currency'           => 'required|string|max:10',
            'interval'           => 'required|in:week,month,quarter,year,once',
            'listing_limit'      => 'nullable|integer|min:0',
            'rental_limit'       => 'nullable|integer|min:0',
            'sale_limit'         => 'nullable|integer|min:0',
            'priority_ranking'   => 'boolean',
            'analytics_access'   => 'boolean',
            'is_active'          => 'boolean',
            'sort_order'         => 'required|integer|min:0',
            'features'           => 'required|array'
        ]);

        // Filter out empty features
        $data['features'] = array_filter($data['features'], fn($feature) => !empty(trim($feature)));

        $data['plan_id'] = Plan::generateUUID();
        $plan = Plan::create($data);

        AdminAuditLog::record('plan', 'Plan created', [
            'affected_user' => $plan->name,
            'affected_id'   => $plan->id,
            'notes'         => "Plan \"{$plan->name}\" created ({$plan->price} {$plan->currency}/{$plan->interval}).",
            'properties'    => ['price' => $plan->price, 'interval' => $plan->interval, 'is_active' => $plan->is_active],
        ]);

        return redirect()->back()->with('success', 'Plan created');
    }

    public function update(Request $request, Plan $plan)
    {
        $data = $request->validate([
            'name'               => 'required|string|max:255',
            'slug'               => 'nullable|string|unique:plans,slug,' . $plan->id,
            'price'              => 'required|numeric|min:0',
            'description'        => 'required|string',
            'currency'           => 'required|string|max:10',
            'interval'           => 'required|in:week,month,quarter,year,once',
            'listing_limit'      => 'nullable|integer|min:0',
            'rental_limit'       => 'nullable|integer|min:0',
            'sale_limit'         => 'nullable|integer|min:0',
            'priority_ranking'   => 'boolean',
            'analytics_access'   => 'boolean',
            'is_active'          => 'boolean',
            'sort_order'         => 'required|integer|min:0',
            'features'           => 'required|array'
        ]);

        // Filter out empty features
        $data['features'] = array_filter($data['features'], fn($feature) => !empty(trim($feature)));

        $before = $plan->only(['price', 'interval', 'is_active', 'sort_order']);
        $plan->update($data);

        AdminAuditLog::record('plan', 'Plan updated', [
            'affected_user' => $plan->name,
            'affected_id'   => $plan->id,
            'notes'         => "Plan \"{$plan->name}\" updated.",
            'properties'    => ['before' => $before, 'after' => [
                'price' => $data['price'], 'interval' => $data['interval'],
                'is_active' => $data['is_active'] ?? false, 'sort_order' => $data['sort_order'],
            ]],
        ]);

        return redirect()->back()->with('success', 'Plan updated');
    }

    public function destroy(Plan $plan)
    {
        $name = $plan->name;
        $id   = $plan->id;
    
        $plan->delete();
    
        AdminAuditLog::record('plan', 'Plan deleted', [
            'affected_user' => $name,
            'affected_id'   => $id,
            'notes'         => "Plan \"{$name}\" permanently deleted.",
            'properties'    => [],
        ]);
    
        return redirect()->back()->with('success', 'Plan deleted');
    }
}
