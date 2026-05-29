<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrailingSlashMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->method() === 'GET') {
            $uri = $request->getRequestUri();
            $path = $request->path();

            if ($path !== '/' && str_ends_with($uri, '/') && ! str_contains($uri, '?')) {
                return redirect(rtrim($request->fullUrl(), '/'), 301);
            }
        }

        return $next($request);
    }
}
