<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Contracts\IdentityVerificationProvider;
use App\Services\Verification\SandboxNiaProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(IdentityVerificationProvider::class, function () {
            // TODO: swap for a real NiaApiProvider once NIA integration
            // credentials/endpoint documentation are available.
            return new SandboxNiaProvider();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
