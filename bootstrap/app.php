<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\EnsureAgentIsAuthenticated;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Middleware\RequiresSubscription;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
            $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
            $middleware->alias([
            'role' => RoleMiddleware::class,
            'subscription' => RequiresSubscription::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'webhooks/*',
        ]);
        
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
