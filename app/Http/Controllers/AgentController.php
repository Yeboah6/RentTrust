<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use Illuminate\Support\Str;
use App\Mail\AgentRegistration;

class AgentController extends Controller
{
    public function becomeAgent()
    {
        return inertia('BecomeAgentPage');
    }

    public function agent()
    {
        $agents = User::where('role', 'agent')
            ->orWhere('role', 'landlord')
            // ->whereIn('status', ['verified', 'unverified', 'pending'])
            ->withCount('rentals')
            ->withCount('reviews')
            ->withAvg('reviews', 'overall_rating')
            ->get();

        return inertia('AgentsPage', [
            'agents' => $agents,
        ]);
    }

    public function storeBecomeAgent(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'phone'    => 'required|string|max:20|unique:users,phone',
            'email'    => 'required|email|unique:users,email',
            'company'  => 'nullable|string|max:255',
            'type'     => 'required|string',
            'fee'      => 'nullable|numeric|min:0',
            'bio'      => 'nullable|string|max:1000',
            'password' => 'required|string|min:8|max:12',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['role']     = 'agent';
        $validated['status']   = 'unverified';
        $validated['package']  = null; // No plan yet — modal will prompt them
        $validated['user_id']  = Str::uuid();

        $agent = User::create($validated);

        Auth::login($agent);

        // Send registration confirmation email
        try {
            Mail::to($agent->email)->queue(new AgentRegistration(
                agentName: $agent->name,
                agentEmail: $agent->email,
                agentType: $agent->type ?? 'Agent',
                dashboardUrl: route('free.agent.dashboard'),
            ));
        } catch (\Exception $e) {
            \Log::error('Failed to send agent registration email: ' . $e->getMessage());
        }

        return redirect()->route('free.agent.dashboard')
            ->with('show_plan_modal', true);
    }
    
    public function selectPlan(Request $request)
    {
        $request->validate([
            'package' => 'required|string|in:free,pro,elite',
        ]);

        $user = Auth::user();

        if ($request->package === 'free' || $request->package === null) {
            // Activate free plan properly via CheckoutController helper
            $plan = \App\Models\Plan::where('slug', 'free')->firstOrFail();
            app(CheckoutController::class)->activateFreeForAgent($user, $plan);

            return redirect()->route('free.agent.dashboard')
                ->with('success', 'Free plan activated!');
        }

        // Paid plans: redirect to checkout — should not normally reach here
        // because PricingModal handles paid plans via router.visit('/checkout/slug')
        return redirect()->to("/checkout/{$request->package}");
    }
}