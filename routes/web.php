<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RentController;
use App\Http\Controllers\AuthController;

Route::resource('rent', RentController::class) -> except('index');

Route::get('/', [RentController::class, 'index']);

Route::get('/listings', [RentController::class, 'listings']);
Route::get('/areas', [RentController::class, 'area']);
Route::get('/agents', [RentController::class, 'agent']);
Route::get('/calculator', [RentController::class, 'calculate']);
Route::get('/claim-listings', [RentController::class, 'claimListings']);
Route::get('/become-agent', [RentController::class, 'becomeAgent']);
Route::get('/calculator', [RentController::class, 'calculate']);
Route::get('/reviews', [RentController::class, 'reviews']);
Route::get('/property-detail', [RentController::class, 'propertyDetail']);
Route::get('/report-listings', [RentController::class, 'reportListings']);

Route::get('/agent-dashboard', [RentController::class, 'agentDashboard']);
Route::get('/super-admin', [RentController::class, 'superAdmin']);


Route::get('/sign-up', [AuthController::class, 'signUp']);
Route::post('/sign-up', [AuthController::class, 'store']);
