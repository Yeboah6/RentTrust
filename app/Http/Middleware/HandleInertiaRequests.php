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
        return [
            ...parent::share($request),

            'auth' => [
                'tenant' => $request->user() && $request->user()->role === 'tenant' 
                    ? $request->user() 
                    : null,
                'agent' => $request->user() && $request->user()->role === 'agent' 
                    ? $request->user() 
                    : null,
                'super' => $request->user() && $request->user()->role === 'admin' 
                    ? $request->user() 
                    : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
