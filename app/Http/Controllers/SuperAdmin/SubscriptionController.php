<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Subscription;

class SubscriptionController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:super_admin']);
    }

    public function index()
    {
        $subscriptions = Subscription::with('user', 'plan')->get();
        return inertia('SuperAdmin/Subscriptions/Index', ['subscriptions' => $subscriptions]);
    }

    public function cancel(Subscription $subscription)
    {
        $subscription->status = 'cancelled';
        $subscription->save();
        return back()->with('success', 'Subscription cancelled');
    }

    public function extend(Request $request, Subscription $subscription)
    {
        // extension logic here
        return back()->with('success', 'Subscription extended');
    }

    public function upgrade(Request $request, Subscription $subscription)
    {
        // manual upgrade logic
        return back()->with('success', 'Subscription upgraded');
    }
}
