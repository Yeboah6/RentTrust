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
                // keep existing "super" slot for any administrator (admin or super_admin)
                'super' => $request->user() && in_array($request->user()->role, ['admin','super_admin'])
                    ? $request->user()
                    : null,
                // explicit admin key for fine-grained checks
                'admin' => $request->user() && $request->user()->role === 'admin'
                    ? $request->user()
                    : null,
            ],
            'flash' => [
                'success'   => fn () => $request->session()->get('success'),
                'error'     => fn () => $request->session()->get('error'),
                'toast'     => $request->session()->get('toast'),
                'emailSent' => fn () => $request->session()->get('emailSent'),
            ],
        ];
    }
}
