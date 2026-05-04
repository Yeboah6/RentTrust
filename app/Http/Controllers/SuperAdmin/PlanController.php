<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Plan;

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
            'boost_limit'        => 'nullable|integer|min:0',
            'lead_limit'         => 'nullable|integer|min:0',
            'verified_badge'     => 'boolean',
            'priority_ranking'   => 'boolean',
            'analytics_access'   => 'boolean',
            'paystack_plan_code' => 'nullable|string|max:255',
            'flutterwave_plan_id'=> 'nullable|string|max:255',
            'is_active'          => 'boolean',
            'sort_order'         => 'required|integer|min:0',
            'features'           => 'required|array'
        ]);

        // Filter out empty features
        $data['features'] = array_filter($data['features'], fn($feature) => !empty(trim($feature)));

        $data['plan_id'] = Plan::generateUUID();
        Plan::create($data);
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
            'boost_limit'        => 'nullable|integer|min:0',
            'lead_limit'         => 'nullable|integer|min:0',
            'verified_badge'     => 'boolean',
            'priority_ranking'   => 'boolean',
            'analytics_access'   => 'boolean',
            'paystack_plan_code' => 'nullable|string|max:255',
            'flutterwave_plan_id'=> 'nullable|string|max:255',
            'is_active'          => 'boolean',
            'sort_order'         => 'required|integer|min:0',
            'features'           => 'required|array'
        ]);

        // Filter out empty features
        $data['features'] = array_filter($data['features'], fn($feature) => !empty(trim($feature)));

        $plan->update($data);
        return redirect()->back()->with('success', 'Plan updated');
    }

    public function destroy(Plan $plan)
    {
        $plan->delete();
        return redirect()->back()->with('success', 'Plan deleted');
    }
}
