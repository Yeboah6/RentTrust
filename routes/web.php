<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\RentController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\PaymentsController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\VerificationsController;

Route::resource('rent', RentController::class) -> except('index');

Route::get('/', [RentController::class, 'index']);

Route::get('/listings', [RentController::class, 'listings']);
Route::get('/api/listings/more', [RentController::class, 'getMoreListings'])->name('listings.more');

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

Route::get('pricing', [RentController::class, 'pricing'])->name('pricing.page');
// Route::get('/checkout/plan={plan}', [RentController::class, 'checkout'])->name('checkout.page');
Route::get('/select-plan', function () {
    return inertia('SelectPlan');
})->name('agent.plan.select')->middleware('auth');

Route::post('/agent/select-plan', [AgentController::class, 'selectPlan'])
    ->middleware('auth');

Route::get('/agents', [AgentController::class, 'agent']) -> name('agents.page');
Route::get('/become-agent', [AgentController::class, 'becomeAgent']);
Route::post('/become-agent', [AgentController::class, 'storeBecomeAgent']);

// Protected Agent Routes
Route::middleware(['auth', 'role:agent'])->group(function () {
    Route::get('/agent-dashboard', [DashboardController::class, 'agentDashboard'])->name('agent.dashboard');
    Route::post('/rent', [RentController::class, 'store']);
    Route::put('/response', [RentController::class, 'response']);
    Route::post('/verification-requests', [VerificationsController::class, 'store'])
        ->name('verification.store');
    Route::delete('/api/verification-requests/{id}', [VerificationsController::class, 'destroy'])
        ->name('verification.destroy');
});

Route::get('/agent/dashboard', [DashboardController::class, 'freeTier'])->name('free.agent.dashboard');

Route::prefix('webhooks')->group(function () {
    Route::post('/paystack', [WebhookController::class, 'paystack'])->name('webhook.paystack');
    Route::post('/flutterwave', [WebhookController::class, 'flutterwave'])->name('webhook.flutterwave');
});

// ─── Checkout (auth required) ─────────────────────────────────────────────────
Route::middleware(['auth'])->group(function () {

    // Single route handles: /checkout/2, /checkout/verified, /checkout/plan=verified
    // The show() method resolves all three formats internally.
    Route::get('/checkout/{plan}', [CheckoutController::class, 'show'])
        ->name('checkout.show')
        ->where('plan', '.*');  // allow = sign and URL-encoded chars in segment

    Route::post('/checkout/start', [CheckoutController::class, 'start'])
        ->name('checkout.start');

    Route::post('/checkout/cancel', [CheckoutController::class, 'cancel'])
        ->name('checkout.cancel');

    Route::get('/payment/callback', [CheckoutController::class, 'callback'])
        ->name('payment.callback');
});


Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/super-admin', [DashboardController::class, 'superAdmin'])->name('admin.dashboard');
    Route::put('/admin/reports/{id}/status', [RentController::class, 'updateReportStatus'])
    ->name('admin.reports.status');
    Route::put('/admin/agents/{id}/verify', [VerificationsController::class, 'verifyAgent'])
    ->name('admin.verify.agent');
    Route::put('/admin/agents/{id}/suspend', [VerificationsController::class, 'suspendAgent'])
    ->name('admin.suspend.agent');
    Route::put('/admin/listings/{rent}/toggle-approval', [RentController::class, 'toggleApprovalStatus'])
    ->name('admin.listings.toggle-approval');
    Route::get('/api/verification-requests', [VerificationsController::class, 'index'])
        ->name('verification.index');
    Route::patch('/api/verification-requests/{id}/status', [VerificationsController::class, 'updateStatus'])
        ->name('verification.update-status');
    Route::get('/api/verification-requests/{id}', [VerificationsController::class, 'show'])
        ->name('verification.show');
    Route::get('/admin/payments/dashboard', [PaymentsController::class, 'paymentDashboard']);
});

Route::get('settings', [AuthController::class, 'settings'])->name('settings.page');
Route::put('settings/profile/agent', [AuthController::class, 'updateAgentProfile'])->name('settings.agent.page');
Route::put('settings/profile/admin', [AuthController::class, 'updateAdminProfile'])->name('settings.admin.page');
// password update route (current user)
Route::put('settings/password', [AuthController::class, 'updatePassword'])->name('settings.password');

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');


Route::get('/sign-up', [AuthController::class, 'signUp']) -> name('sign-up.page');
Route::post('/sign-up', [AuthController::class, 'store']);

// login form and action routes
Route::get('/login', function () {
    return inertia('Auth/AuthPage', ['isLogin' => true]);
})->name('login');

Route::post('/login', [AuthController::class, 'login'])->name('login.post');

Route::get('/forgot-password', [PasswordResetController::class, 'showForgotPasswordForm'])
    ->name('password.request');

Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])
    ->name('password.email');

Route::get('/reset-password/{token}', [PasswordResetController::class, 'showResetPasswordForm'])
        ->name('password.reset');

// Handle reset password form submission
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])
    ->name('password.update');
