<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RentController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PasswordResetController;

Route::resource('rent', RentController::class) -> except('index');

Route::get('/', [RentController::class, 'index']);

Route::get('/listings', [RentController::class, 'listings']);

Route::get('/areas', [RentController::class, 'areas']);
Route::get('/areas/{city}/{area}', [RentController::class, 'showArea'])->name('areas.show');
Route::get('/api/areas/search', [RentController::class, 'searchAreas'])->name('areas.search');
Route::get('/api/areas/city/{city}', [RentController::class, 'getAreasByCity'])->name('areas.by-city');


Route::get('/calculator', [RentController::class, 'calculate']);
Route::get('/claim-listings', [RentController::class, 'claimListings']);

Route::get('/calculator', [RentController::class, 'calculate']);
Route::get('/reviews-reports', [RentController::class, 'reviews']);

Route::post('/report-listing', [RentController::class, 'reportListing'])->name('report.listing');

Route::post('/review-forms', [RentController::class, 'storeReviewForms']);
Route::post('/reviews/app', [RentController::class, 'storeReviewApp'])->name('reviews.app');

Route::get('/agents', [AgentController::class, 'agent']) -> name('agents.page');
Route::get('/become-agent', [AgentController::class, 'becomeAgent']);
Route::post('/become-agent', [AgentController::class, 'storeBecomeAgent']);

// Protected Agent Routes
Route::middleware('agent')->group(function () {
    Route::get('/agent-dashboard', [DashboardController::class, 'agentDashboard']);
    Route::post('/rent', [RentController::class, 'store']);
    Route::put('/response', [RentController::class, 'response']);
});

Route::middleware('super')->group(function () {
    Route::get('/super-admin', [DashboardController::class, 'superAdmin']);
    Route::put('/admin/reports/{id}/status', [RentController::class, 'updateReportStatus'])
    ->name('admin.reports.status');
    Route::put('/admin/agents/{id}/verify', [RentController::class, 'verifyAgent'])
    ->name('admin.verify.agent');
    Route::put('/admin/agents/{id}/suspend', [RentController::class, 'suspendAgent'])
    ->name('admin.verify.agent');
});

Route::get('settings', [AuthController::class, 'settings'])->name('settings.page');
Route::put('settings/profile/agent', [AuthController::class, 'updateAgentProfile'])->name('settings.agent.page');
Route::put('settings/profile/admin', [AuthController::class, 'updateAdminProfile'])->name('settings.admin.page');

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');


Route::get('/sign-up', [AuthController::class, 'signUp']) -> name('sign-up.page');
Route::post('/sign-up', [AuthController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/forgot-password', [PasswordResetController::class, 'showForgotPasswordForm'])
    ->name('password.request');

Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])
    ->name('password.email');

Route::get('/reset-password/{token}', [PasswordResetController::class, 'showResetPasswordForm'])
        ->name('password.reset');

// Handle reset password form submission
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])
    ->name('password.update');
