<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return redirect()->route('login')->with('error', 'Please log in to access this page.');
        }

        $user = auth()->user();

        if ($user->role === 'agent' && $user->status === 'suspended') {
            auth()->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->withErrors([
                'suspended' => 'Your account has been suspended. Please contact support for assistance.',
            ]);
        }

        // Get the authenticated user's role
        $userRole = $user->role;

        // Check if user has the required role
        if ($userRole !== $role) {
            // Redirect to appropriate dashboard based on actual role
            if ($userRole === 'agent') {
                return redirect()->route('agent.dashboard')->with('error', 'Access denied to that section.');
            } elseif ($userRole === 'admin') {
                // existing admin panel
                return redirect()->route('admin.dashboard')->with('error', 'Access denied to that section.');
            } elseif ($userRole === 'super_admin') {
                // redirect to super admin dashboard
                return redirect()->route('super-admin.dashboard')->with('error', 'Access denied to that section.');
            } elseif ($userRole === 'tenant') {
                return redirect('/')->with('error', 'Access denied to that section.');
            }
            
            // Fallback for unknown roles
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}
