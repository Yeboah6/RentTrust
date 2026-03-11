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

// all routes are prefixed with super-admin and guarded by role middleware
Route::prefix('super-admin')->middleware(['auth','verified','role:super_admin'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('super-admin.dashboard');

    // SaaS management
    Route::resource('plans', PlanController::class)->parameters(['plans' => 'plan']);
    Route::get('subscriptions', [SubscriptionController::class, 'index'])->name('super-admin.subscriptions.index');
    Route::get ('/{id}', SubscriptionController::class . '@show')->name('show');

    // Route::post('subscriptions/{subscription}/cancel', [SubscriptionController::class, 'cancel'])->name('super-admin.subscriptions.cancel');
    // Route::post('subscriptions/{subscription}/extend', [SubscriptionController::class, 'extend'])->name('super-admin.subscriptions.extend');
    // Route::post('subscriptions/{subscription}/upgrade', [SubscriptionController::class, 'upgrade'])->name('super-admin.subscriptions.upgrade');

    // Actions
    Route::post('/{id}/cancel',     SubscriptionController::class . '@cancel')  ->name('cancel');
    Route::post('/{id}/suspend',    SubscriptionController::class . '@suspend') ->name('suspend');
    Route::post('/{id}/extend',     SubscriptionController::class . '@extend')  ->name('extend');
    Route::post('/{id}/upgrade',    SubscriptionController::class . '@upgrade') ->name('upgrade');

    // Admin-issued free subscription (grant)
    Route::post('/grant',           SubscriptionController::class . '@grant')   ->name('grant');

    Route::resource('agents', AgentController::class);
    Route::resource('listings', ListingController::class);

    Route::get('payments', [PaymentController::class, 'index'])->name('super-admin.payments.index');
    Route::post('payments/{payment}/refund', [PaymentController::class, 'refund'])->name('super-admin.payments.refund');

    // admin accounts
    Route::resource('admins', AdminController::class)->parameters(['admins' => 'user']);
    Route::post('admins/{user}/reset-password', [AdminController::class, 'resetPassword'])->name('super-admin.admins.reset-password');
    Route::post('admins/{user}/suspend', [AdminController::class, 'suspend'])->name('super-admin.admins.suspend');
    Route::post('admins/{user}/reactivate', [AdminController::class, 'reactivate'])->name('super-admin.admins.reactivate');

    // configuration
    Route::resource('property-types', PropertyTypeController::class)->only(['index','store','update','destroy']);
    Route::resource('locations', LocationController::class)->only(['index','store','update','destroy']);
    Route::resource('amenities', AmenityController::class)->only(['index','store','update','destroy']);
    Route::get('settings', [SettingsController::class, 'index'])->name('super-admin.settings.index');
    Route::post('settings', [SettingsController::class, 'update'])->name('super-admin.settings.update');
    Route::get('features', [FeatureFlagController::class, 'index'])->name('super-admin.features.index');
    Route::post('features', [FeatureFlagController::class, 'update'])->name('super-admin.features.update');

    // support & system tools
    Route::get('impersonate/{user}', [SystemController::class, 'impersonate'])->name('super-admin.impersonate');
    // Route::get('logs', [SystemController::class, 'logs'])->name('super-admin.logs');

    Route::get ('audit-log',          [SystemController::class, 'index'])  ->name('audit-log.index');
    Route::get ('audit-log/{id}',     [SystemController::class, 'show'])   ->name('audit-log.show');
    Route::get ('audit-log/export',   [SystemController::class, 'export']) ->name('audit-log.export');
});
