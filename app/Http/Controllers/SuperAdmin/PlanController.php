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

    public function create()
    {
        return inertia('SuperAdmin/Plans/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'               => 'required|string|max:255',
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
        ]);

        Plan::create($data);
        return redirect()->back()->with('success', 'Plan created');
    }

    public function edit(Plan $plan)
    {
        return inertia('SuperAdmin/Plans/Edit', ['plan' => $plan]);
    }

    public function update(Request $request, Plan $plan)
    {
        $data = $request->validate([
            'name'               => 'required|string|max:255',
            'slug'               => 'nullable|string|unique:plans,slug,' . $plan->id,
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
        ]);

        $plan->update($data);
        return redirect()->back()->with('success', 'Plan updated');
    }

    public function destroy(Plan $plan)
    {
        $plan->delete();
        return redirect()->back()->with('success', 'Plan deleted');
    }
}
