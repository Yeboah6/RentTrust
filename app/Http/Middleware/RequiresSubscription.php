<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RequiresSubscription
{
    /**
     * Usage: Route::middleware('subscription:pro,elite')
     * Passes plan slugs that are allowed. Empty = any active paid plan.
     */
    public function handle(Request $request, Closure $next, string ...$plans): mixed
    {
        $user = auth()->user();
        $subscription = $user?->subscription;

        if (! $subscription || ! $subscription->isActive()) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Active subscription required.'], 403);
            }

            return redirect()->route('checkout.index')
                ->with('error', 'Please subscribe to access this feature.');
        }

        // Check specific plan requirement
        if (! empty($plans) && ! in_array($subscription->plan->slug, $plans)) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Upgrade your plan to access this feature.'], 403);
            }

            return redirect()->route('checkout.index')
                ->with('error', 'Upgrade your plan to access this feature.');
        }

        return $next($request);
    }
}