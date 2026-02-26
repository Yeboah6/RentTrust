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

        // Subscription state — shared globally so any page can gate features
        $subscription = null;
        if ($user) {
            $sub = $user->subscription;
            if ($sub && $sub->isActive()) {
                $subscription = [
                    'plan'        => $sub->plan?->slug,
                    'plan_name'   => $sub->plan?->name,
                    'status'      => $sub->status,
                    'ends_at'     => $sub->ends_at?->toDateString(),
                    'days_left'   => $sub->daysUntilExpiry(),
                    'grace'       => $sub->inGracePeriod(),
                ];
            }
        }

        return [
            ...parent::share($request),

            'auth' => [
                'tenant' => $user && $user->role === 'tenant' ? $user : null,
                'agent'  => $user && $user->role === 'agent'  ? $user : null,
                'super'  => $user && $user->role === 'admin'  ? $user : null,
            ],

            // Active subscription info — null if none / expired
            'subscription' => $subscription,

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
        ];
    }
}