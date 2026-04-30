<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleCheckMiddleware
{
    /**
     * Handle an incoming request.
     * Accepts multiple allowed roles (admin,super_admin)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return redirect()->route('login')->with('error', 'Please log in to access this page.');
        }

        // Get the authenticated user's role
        $userRole = auth()->user()->role;

        // Check if user has one of the required roles
        if (!in_array($userRole, $roles)) {
            // Redirect to appropriate dashboard based on actual role
            if ($userRole === 'agent') {
                return redirect()->route('agent.dashboard')->with('error', 'Access denied to that section.');
            } elseif ($userRole === 'admin') {
                return redirect()->route('admin.dashboard')->with('error', 'Access denied to that section.');
            } elseif ($userRole === 'super_admin') {
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
