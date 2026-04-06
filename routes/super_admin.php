<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\SuperAdmin\PlanController;
use App\Http\Controllers\SuperAdmin\SubscriptionController;
use App\Http\Controllers\SuperAdmin\PaymentController;
use App\Http\Controllers\SuperAdmin\AdminController;
use App\Http\Controllers\SuperAdmin\AgentController;
use App\Http\Controllers\SuperAdmin\ListingController;
use App\Http\Controllers\SuperAdmin\PropertyTypeController;
use App\Http\Controllers\SuperAdmin\LocationController;
use App\Http\Controllers\SuperAdmin\AmenityController;
use App\Http\Controllers\SuperAdmin\SettingsController;
use App\Http\Controllers\SuperAdmin\FeatureFlagController;
use App\Http\Controllers\SuperAdmin\SystemController;
use App\Http\Controllers\SuperAdmin\TenantController;
use App\Http\Controllers\SuperAdmin\ProfileController;
use App\Http\Controllers\SuperAdmin\ReviewsReportsController;

Route::prefix('super-admin')
    ->name('super-admin.')
    ->middleware(['auth', 'verified', 'role:super_admin'])
    ->group(function () {

    // ── Dashboard ─────────────────────────────────────────────────────────────
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // ── Plans ─────────────────────────────────────────────────────────────────
    Route::resource('plans', PlanController::class)
        ->parameters(['plans' => 'plan']);

    // ── Subscriptions ─────────────────────────────────────────────────────────
    // IMPORTANT: specific action routes must come before the wildcard show route
    Route::prefix('subscriptions')->name('subscriptions.')->group(function () {
        Route::get('/',             [SubscriptionController::class, 'index'])   ->name('index');
        Route::get('/{id}',         [SubscriptionController::class, 'show'])    ->name('show');
        Route::post('/{id}/cancel', [SubscriptionController::class, 'cancel'])  ->name('cancel');
        Route::post('/{id}/suspend',[SubscriptionController::class, 'suspend']) ->name('suspend');
        Route::post('/{id}/extend', [SubscriptionController::class, 'extend'])  ->name('extend');
        Route::post('/{id}/upgrade',[SubscriptionController::class, 'upgrade']) ->name('upgrade');
        Route::post('/grant',       [SubscriptionController::class, 'grant'])   ->name('grant');
    });

    // ── Payments ──────────────────────────────────────────────────────────────
    Route::get('payments', [PaymentController::class, 'index'])  ->name('payments.index');
    Route::get('payments/{id}', [PaymentController::class, 'show'])->name('payments.show');
    Route::post('payments/{payment}/refund', [PaymentController::class, 'refund']) ->name('payments.refund');

    // ── Agents ────────────────────────────────────────────────────────────────
    Route::resource('agents', AgentController::class)
        ->only(['index', 'show', 'edit', 'update', 'destroy', 'create']);

    // Status action routes
    Route::post('agents/{agent}/verify',     [AgentController::class, 'verify'])     ->name('agents.verify');
    Route::post('agents/{agent}/suspend',    [AgentController::class, 'suspend'])    ->name('agents.suspend');
    Route::post('agents/{agent}/reactivate', [AgentController::class, 'reactivate']) ->name('agents.reactivate');

    Route::resource('tenants', TenantController::class)
        ->only(['index', 'show', 'destroy']);
 
    // Status actions
    Route::post('tenants/{tenant}/suspend',    [TenantController::class, 'suspend'])    ->name('tenants.suspend');
    Route::post('tenants/{tenant}/reactivate', [TenantController::class, 'reactivate']) ->name('tenants.reactivate');

    // ── Listings ──────────────────────────────────────────────────────────────
    // Verification page
    Route::get('listings/verification', [ListingController::class, 'verification'])
        ->name('listings.verification');
 
    Route::resource('listings', ListingController::class)
        ->only(['index', 'show', 'edit', 'update', 'destroy', 'create', 'store']);
 
    // Status action routes
    Route::post('listings/{listing}/approve', [ListingController::class, 'approve'])
        ->name('listings.approve');
    
    Route::post('listings/{listing}/reject',  [ListingController::class, 'reject'])
        ->name('listings.reject');
    
    Route::post('listings/{listing}/suspend', [ListingController::class, 'suspend'])
        ->name('listings.suspend');

    // ── Admin accounts ────────────────────────────────────────────────────────
    Route::resource('admins', AdminController::class)
        ->parameters(['admins' => 'user']);
    Route::post('admins/{user}/reset-password', [AdminController::class, 'resetPassword']) ->name('admins.reset-password');
    Route::post('admins/{user}/suspend',        [AdminController::class, 'suspend'])        ->name('admins.suspend');
    Route::post('admins/{user}/reactivate',     [AdminController::class, 'reactivate'])     ->name('admins.reactivate');

    // ── Platform config ───────────────────────────────────────────────────────
    Route::resource('property-types', PropertyTypeController::class)
        ->only(['index', 'store', 'update', 'destroy']);
    Route::resource('locations', LocationController::class)
        ->only(['index', 'store', 'update', 'destroy']);
    Route::resource('amenities', AmenityController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::get ('settings', [SettingsController::class, 'index'])  ->name('settings.index');
    Route::post('settings', [SettingsController::class, 'update']) ->name('settings.update');

    Route::get ('features', [FeatureFlagController::class, 'index'])  ->name('features.index');
    Route::post('features', [FeatureFlagController::class, 'update']) ->name('features.update');

    // ── Support & system ──────────────────────────────────────────────────────
    Route::get('impersonate/{user}', [SystemController::class, 'impersonate']) ->name('impersonate');

    // Audit log — specific routes before any wildcard patterns
    Route::get('audit-log/export', [SystemController::class, 'export']) ->name('audit-log.export');
    Route::get('audit-log/{id}',   [SystemController::class, 'show'])   ->name('audit-log.show');
    Route::get('audit-log',        [SystemController::class, 'index'])  ->name('audit-log.index');

    Route::get ('profile',          [ProfileController::class, 'show'])           ->name('profile');
    Route::patch('profile',         [ProfileController::class, 'update'])         ->name('profile.update');
    Route::put  ('profile/password',[ProfileController::class, 'updatePassword']) ->name('profile.password');

    Route::get ('reports-reviews',             [ReviewsReportsController::class, 'index'])           ->name('reports-reviews');
    Route::post('reviews/{review}/reply',      [ReviewsReportsController::class, 'reply'])           ->name('reviews.reply');
    Route::post('reports/{report}/status',     [ReviewsReportsController::class, 'reportStatus'])    ->name('reports.status');
    Route::delete('reviews/{review}',          [ReviewsReportsController::class, 'deleteReview'])    ->name('reviews.destroy');
    Route::delete('app-reviews/{review}',      [ReviewsReportsController::class, 'deleteAppReview'])->name('app-reviews.destroy');
    Route::delete('reports/{report}',          [ReviewsReportsController::class, 'deleteReport'])    ->name('reports.destroy');
});
