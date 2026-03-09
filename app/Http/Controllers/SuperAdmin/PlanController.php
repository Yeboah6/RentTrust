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
            'name' => 'required|string',
            'price' => 'required|numeric',
            'billing_cycle' => 'required|string',
            'rental_limit' => 'nullable|integer',
            'sale_limit' => 'nullable|integer',
            'boost_limit' => 'nullable|integer',
            'analytics_access' => 'boolean',
        ]);

        Plan::create($data);
        return redirect()->route('super-admin.plans.index')->with('success', 'Plan created');
    }

    public function edit(Plan $plan)
    {
        return inertia('SuperAdmin/Plans/Edit', ['plan' => $plan]);
    }

    public function update(Request $request, Plan $plan)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'billing_cycle' => 'required|string',
            'rental_limit' => 'nullable|integer',
            'sale_limit' => 'nullable|integer',
            'boost_limit' => 'nullable|integer',
            'analytics_access' => 'boolean',
        ]);

        $plan->update($data);
        return redirect()->route('super-admin.plans.index')->with('success', 'Plan updated');
    }

    public function destroy(Plan $plan)
    {
        $plan->delete();
        return redirect()->route('super-admin.plans.index')->with('success', 'Plan deleted');
    }
}
