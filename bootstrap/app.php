<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\EnsureAgentIsAuthenticated;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Middleware\RoleCheckMiddleware;
use App\Http\Middleware\RequiresSubscription;
use Illuminate\Console\Scheduling\Schedule;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
            $middleware->web(append: [
            HandleInertiaRequests::class,
            \App\Http\Middleware\TrailingSlashMiddleware::class,
            \App\Http\Middleware\CanonicalUrlMiddleware::class,
        ]);
            $middleware->alias([
            'role' => RoleMiddleware::class,
            'roles' => RoleCheckMiddleware::class,
            'subscription' => RequiresSubscription::class,
            'noindex' => \App\Http\Middleware\NoIndexAdminMiddleware::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'webhooks/*',
        ]);
        
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    
    ->withSchedule(function (Schedule $schedule) {
        // Schedule your commands here
        $schedule->command('subscriptions:notify-expiry')
            ->dailyAt('09:00')
            ->withoutOverlapping()
            ->appendOutputTo(storage_path('logs/subscription-notifications.log'));

        $schedule->command('subscriptions:expire')
            ->dailyAt('01:00');
    })
    ->create();
