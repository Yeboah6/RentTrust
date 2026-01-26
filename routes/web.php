<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RentController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;

Route::resource('rent', RentController::class) -> except('index');

Route::get('/', [RentController::class, 'index']);

Route::get('/listings', [RentController::class, 'listings']);
Route::get('/areas', [RentController::class, 'area']);

Route::get('/calculator', [RentController::class, 'calculate']);
Route::get('/claim-listings', [RentController::class, 'claimListings']);

Route::get('/calculator', [RentController::class, 'calculate']);
Route::get('/reviews-reports', [RentController::class, 'reviews']);

Route::post('/report-listing', [RentController::class, 'reportListing'])->name('report.listing');

// Route::get('/review-forms', [RentController::class, 'reviewForms']);
Route::post('/review-forms', [RentController::class, 'storeReviewForms']);

Route::get('/agents', [AgentController::class, 'agent']) -> name('agents.page');
Route::get('/become-agent', [AgentController::class, 'becomeAgent']);
Route::post('/become-agent', [AgentController::class, 'storeBecomeAgent']);

// Protected Agent Routes
Route::middleware('agent')->group(function () {
    Route::get('/agent-dashboard', [DashboardController::class, 'agentDashboard']);
    Route::post('/rent', [RentController::class, 'store']);
    Route::put('/response', [RentController::class, 'response']);
    // Route::post('/rent/{id}', [RentController::class, 'store']);
});

Route::middleware('super')->group(function () {
    Route::get('/super-admin', [DashboardController::class, 'superAdmin']);
    Route::put('/admin/reports/{id}/status', [RentController::class, 'updateReportStatus'])
    ->name('admin.reports.status');
});

Route::get('settings', [AuthController::class, 'settings'])->name('settings.page');

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');


Route::get('/sign-up', [AuthController::class, 'signUp']) -> name('sign-up.page');
Route::post('/sign-up', [AuthController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);
