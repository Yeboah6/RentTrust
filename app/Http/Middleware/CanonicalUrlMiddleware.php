<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class CanonicalUrlMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $request->isMethod('GET') || $request->expectsJson()) {
            return $response;
        }

        $route = $request->route()?->getName();
        $params = $request->route()?->parameters() ?? [];

        if (! $route) {
            return $response;
        }

        $canonical = url($request->path());
        if ($request->query()) {
            $canonical = $canonical . '?' . http_build_query($request->query());
        }

        if ($response instanceof Response) {
            $response->headers->set('Link', sprintf('<%s>; rel="canonical"', $canonical));
        }

        return $response;
    }
}
