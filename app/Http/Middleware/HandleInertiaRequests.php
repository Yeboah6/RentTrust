<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),

            'auth' => [
                'tenant' => $user?->role === 'tenant' ? $user : null,
                'agent'  => $user?->role === 'agent'  ? $user : null,
                'super'  => $user?->role === 'admin'  ? $user : null,
            ],

            // Lazily resolved — only runs when Inertia actually serialises it,
            // and only if there is a logged-in user.
            'subscription' => fn () => $this->resolveSubscription($user),

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
        ];
    }

    /**
     * Safely resolve subscription data.
     * Uses eager-loaded plan to avoid N+1.
     * Returns null if user has no active subscription.
     */
    private function resolveSubscription($user): ?array
    {
        if (! $user) {
            return null;
        }

        // Load subscription + plan in ONE query, not two
        $sub = $user->subscription()->with('plan')->first();

        if (! $sub || ! $sub->isActive()) {
            return null;
        }

        return [
            'plan'      => $sub->plan?->slug,
            'plan_name' => $sub->plan?->name,
            'status'    => $sub->status,
            'ends_at'   => $sub->ends_at?->toDateString(),
            'days_left' => $sub->ends_at ? max(0, (int) now()->diffInDays($sub->ends_at, false)) : null,
            'grace'     => $sub->inGracePeriod(),
        ];
    }
}