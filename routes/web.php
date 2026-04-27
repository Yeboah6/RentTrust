<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\RentController;
use App\Http\Controllers\RentalSearchController;
use App\Http\Controllers\SaleSearchController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\PaymentsController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\VerificationsController;
use App\Http\Controllers\AgentAnalyticsController;
use App\Http\Controllers\ContactController;

Route::resource('rent', RentController::class)
    ->except('index')
    ->where(['rent' => '[a-f0-9\-]{36}|[0-9]+']);

Route::get('/', [RentController::class, 'index']);

Route::get('/about', [RentController::class, 'about'])->name('about');
Route::get('/guide', function () { return inertia('Guide'); })->name('guide.page');
Route::get('/safety', function () { return inertia('Safety'); })->name('safety.page');
Route::get('/faq', function () { return inertia('Faq'); })->name('faq.page');
Route::get('/terms', function () { return inertia('Terms'); })->name('terms.page');
Route::get('/privacy', function () { return inertia('Privacy'); })->name('privacy.page');
Route::get('/report', function () { return inertia('Report'); })->name('report.page');

// ── Rental Search Routes ──────────────────────────────────────────────────────
Route::prefix('rent')->group(function () {
    Route::get('/areas', [RentalSearchController::class, 'areas'])->name('rent.areas');
    Route::get('/areas/{city}/{area}', [RentalSearchController::class, 'showArea'])->name('areas.show');
    Route::get('/api/more', [RentalSearchController::class, 'getMore'])->name('rent.more');
    Route::get('/listings', [RentalSearchController::class, 'listings']);
    Route::get('/calculator', [RentController::class, 'calculate']);
});

// ── Sale Search Routes ────────────────────────────────────────────────────────
Route::prefix('buy')->group(function () {
    Route::get('/listings', [SaleSearchController::class, 'index'])->name('buy.index');
    Route::get('/areas', [SaleSearchController::class, 'areas'])->name('buy.areas');
    Route::get('/areas/{city}/{area}', [SaleSearchController::class, 'showArea'])->name('buy.areas.show');
    Route::get('/{rent}', [SaleSearchController::class, 'show'])->where(['rent' => '[0-9]+']);
    Route::get('/api/more', [SaleSearchController::class, 'getMore'])->name('buy.more');
});

// tracking endpoints
Route::post('/api/listings/{rent}/track-view', [RentController::class, 'trackView'])->name('listings.trackView');
Route::post('/api/listings/{rent}/track-inquiry', [RentController::class, 'trackInquiry'])->name('listings.trackInquiry');

// analytics endpoints
Route::get('/api/listings/analytics', [AgentAnalyticsController::class, 'index'])->name('listings.analytics.index');
Route::get('/api/listings/{rent}/analytics', [AgentAnalyticsController::class, 'summary'])->name('listings.analytics.summary');
Route::get('/api/areas/search', [RentController::class, 'searchAreas'])->name('areas.search');
Route::get('/api/areas/city/{city}', [RentController::class, 'getAreasByCity'])->name('areas.by-city');


Route::get('/reviews-reports', [RentController::class, 'reviews']);
Route::post('/report-listing', [RentController::class, 'reportListing'])->name('report.listing');

Route::post('/review-forms', [RentController::class, 'storeReviewForms']);
Route::post('/reviews/app', [RentController::class, 'storeReviewApp'])->name('reviews.app');

// ── Pricing page (public) ────────────────────────────────────────────────────
Route::get('pricing', [RentController::class, 'pricing'])->name('pricing.page');

// ── Contact page
Route::get('contact', [ContactController::class, 'show'])->name('contact.page');
Route::post('/contact', [ContactController::class, 'send'])
    ->name('contact.send')
    ->middleware('throttle:5,1');

Route::post('/agent/select-plan', [AgentController::class, 'selectPlan'])
    ->middleware('auth');

Route::get('/agents', [AgentController::class, 'agent']) -> name('agents.page');
Route::get('/become-agent', [AgentController::class, 'becomeAgent']);
Route::post('/become-agent', [AgentController::class, 'storeBecomeAgent']);

// Protected Agent Routes
Route::middleware(['auth', 'verified', 'throttle:60,1', 'role:agent'])->group(function () {
    Route::get('/agent-dashboard', [DashboardController::class, 'agentDashboard'])->name('agent.dashboard');
    Route::post('/rent', [RentController::class, 'store']);
    Route::put('/response', [RentController::class, 'response']);
    
    // Verification request routes for agents
    Route::post('/api/verification-requests', [VerificationsController::class, 'store'])
        ->name('verification.store');
    Route::delete('/api/verification-requests/{id}', [VerificationsController::class, 'destroy'])
        ->name('verification.destroy');
    Route::get('/api/verification-requests', [VerificationsController::class, 'index'])
        ->name('agent.verification.index');
    Route::get('/api/verification-requests/{id}', [VerificationsController::class, 'show'])
        ->name('agent.verification.show');
    Route::get('/api/rentals/{rentalId}/verification-requests', [VerificationsController::class, 'getRentalRequests'])
        ->name('rental.verification.requests');
    
    Route::post('/api/listings/{rent}/feature', [RentController::class, 'featureListing'])->name('listings.feature');
});

Route::get('/agent/dashboard', [DashboardController::class, 'freeTier'])->middleware(['auth','role:agent','throttle:60,1'])->name('free.agent.dashboard');

Route::prefix('webhooks')->group(function () {
    Route::post('/paystack', [WebhookController::class, 'paystack'])->name('webhook.paystack');
    Route::post('/flutterwave', [WebhookController::class, 'flutterwave'])->name('webhook.flutterwave');
});

// ─── Checkout (auth + verified required) ──────────────────────────────────────
Route::middleware(['auth','verified'])->group(function () {
    Route::get('/checkout/{plan}', [CheckoutController::class, 'show'])
        ->name('checkout.show')
        ->where('plan', '.*');

    Route::post('/checkout/start', [CheckoutController::class, 'start'])
        ->name('checkout.start');

    Route::post('/checkout/cancel', [CheckoutController::class, 'cancel'])
        ->name('checkout.cancel');

    Route::get('/payment/callback', [CheckoutController::class, 'callback'])
        ->name('payment.callback');
});

// ── Admin Routes ──────────────────────────────────────────────────────────────
Route::middleware(['auth','verified','throttle:60,1','role:admin'])->group(function () {
    Route::get('/admin', [DashboardController::class, 'adminDashboard'])->name('admin.dashboard');
    
    // Report management
    Route::put('/admin/reports/{id}/status', [RentController::class, 'updateReportStatus'])
        ->name('admin.reports.status');
    
    // Agent verification and management
    Route::put('/admin/agents/{id}/verify', [VerificationsController::class, 'verifyAgent'])
        ->name('admin.verify.agent');
    Route::put('/admin/agents/{id}/suspend', [VerificationsController::class, 'suspendAgent'])
        ->name('admin.suspend.agent');
    
    // Listing approval
    Route::put('/admin/listings/{rent}/toggle-approval', [RentController::class, 'toggleApprovalStatus'])
        ->name('admin.listings.toggle-approval');
    
    // Rental verification request management
    Route::get('/api/verification-requests', [VerificationsController::class, 'index'])
        ->name('verification.index');
    Route::patch('/api/verification-requests/{id}/status', [VerificationsController::class, 'updateStatus'])
        ->name('verification.update-status');
    Route::get('/api/verification-requests/{id}', [VerificationsController::class, 'show'])
        ->name('verification.show');
    
    // Payment management
    Route::get('/admin/payments/dashboard', [PaymentsController::class, 'paymentDashboard'])
        ->name('admin.payments.dashboard');

    Route::post('/admin/agents/{userId}/grant-subscription', [PaymentsController::class, 'grantSubscription'])
        ->name('admin.agents.grant-subscription');

    Route::post('/admin/payments/{id}/refund', [PaymentsController::class, 'refundPayment'])
        ->name('admin.payments.refund');

    Route::post('/admin/subscriptions/{id}/cancel', [PaymentsController::class, 'cancelSubscription'])
        ->name('admin.subscriptions.cancel');

    Route::get('/admin/payments/filter', [PaymentsController::class, 'filterPayments'])
        ->name('admin.payments.filter');
});

// ── Settings (protected + verified) ──────────────────────────────────────────
Route::middleware(['auth','verified'])->group(function () {
    Route::get('settings', [AuthController::class, 'settings'])->name('settings.page');
    Route::put('settings/profile/agent', [AuthController::class, 'updateAgentProfile'])->name('settings.agent.page');
    Route::put('settings/profile/admin', [AuthController::class, 'updateAdminProfile'])->name('settings.admin.page');
    Route::put('settings/password', [AuthController::class, 'updatePassword'])->name('settings.password')->middleware('password.confirm');
});

// ── Auth ──────────────────────────────────────────────────────────────────────
Route::post('/logout', [AuthController::class, 'logout'])->middleware(['auth','verified'])->name('logout');
Route::get('/sign-up', [AuthController::class, 'signUp']) -> name('sign-up.page');
Route::post('/sign-up', [AuthController::class, 'store']);

// load super‑admin-specific routes (separate file for clarity)
require __DIR__ . '/super_admin.php';

Route::get('/login', function () {
    return inertia('Auth/AuthPage', ['isLogin' => true]);
})->name('login');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1')->name('login.post');

Route::get('/forgot-password', [PasswordResetController::class, 'showForgotPasswordForm'])
    ->name('password.request');
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])
    ->name('password.email');
Route::get('/reset-password/{token}', [PasswordResetController::class, 'showResetPasswordForm'])
        ->name('password.reset');
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])
    ->name('password.update');
