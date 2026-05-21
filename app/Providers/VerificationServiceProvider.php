<?php

namespace App\Providers;

use App\Models\VerificationRequest;
use App\Policies\VerificationRequestPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class VerificationServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        VerificationRequest::class => VerificationRequestPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Define gates if needed
        Gate::define('review-verification', function ($user) {
            return $user->hasRole('super_admin');
        });
    }
}