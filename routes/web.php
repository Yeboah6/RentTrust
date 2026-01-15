<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RentController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\AuthController;

Route::resource('rent', RentController::class) -> except('index');

Route::get('/', [RentController::class, 'index']);

Route::get('/listings', [RentController::class, 'listings']);
Route::get('/areas', [RentController::class, 'area']);

Route::get('/calculator', [RentController::class, 'calculate']);
Route::get('/claim-listings', [RentController::class, 'claimListings']);

Route::get('/calculator', [RentController::class, 'calculate']);
Route::get('/reviews', [RentController::class, 'reviews']);
Route::get('/property-detail', [RentController::class, 'propertyDetail']);
Route::get('/report-listings', [RentController::class, 'reportListings']);
Route::get('/review-forms', [RentController::class, 'reviewForms']);

Route::get('agents', [AgentController::class, 'agent']);
Route::get('/become-agent', [AgentController::class, 'becomeAgent']);
Route::post('/become-agent', [AgentController::class, 'storeBecomeAgent']);

// Route::get('/add-rentals', [RentController::class, 'addRentals']);
// Route::post('/add/rentals', [RentController::class, 'store']);

Route::get('/agent-dashboard', [AgentController::class, 'agentDashboard']);
Route::get('/super-admin', [RentController::class, 'superAdmin']);


Route::get('/sign-up', [AuthController::class, 'signUp']);
Route::post('/sign-up', [AuthController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);
