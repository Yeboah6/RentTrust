<?php

use App\Http\Controllers\CheckoutController;
use App\Models\Plan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Response;

uses(RefreshDatabase::class);

it('renders checkout for paid plans without depending on an is_popular column', function () {
    Plan::create([
        'name' => 'Basic',
        'slug' => 'basic',
        'price' => 10.00,
        'listing_limit' => 5,
        'listing_limit_display' => '5',
        'boost_limit' => 1,
        'lead_limit' => 2,
        'verified_badge' => false,
        'priority_ranking' => false,
        'analytics_access' => false,
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $controller = app(CheckoutController::class);
    $response = $controller->show('basic');

    expect($response)->toBeInstanceOf(Response::class);
    expect($response->getData()['plan']['slug'])->toBe('basic');
});
