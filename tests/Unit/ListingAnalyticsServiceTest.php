<?php

use App\Models\Rental;
use App\Models\ListingView;
use App\Models\ListingInquiry;
use App\Services\ListingAnalyticsService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(Tests\TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->service = new ListingAnalyticsService();
});

it('correctly aggregates views and inquiries and computes metrics', function () {
    // create a user to own the rental
    $user = \App\Models\User::create([
        'name' => 'Test Agent',
        'email' => 'agent@test.com',
        'password' => 'password',
        'role' => 'agent',
    ]);

    // create a rental manually (required fields)
    $rent = Rental::create([
        'user_id' => $user->id,
        'title' => 'Test Listing',
        'property_type' => 'apartment',
        'city' => 'TestCity',
        'area' => 'TestArea',
        'address' => '123 Test Ave',
        'rent_min' => 100,
        'rent_max' => 200,
        'advance_duration' => 1,
        'bedrooms' => 1,
        'bathrooms' => 1,
        'description' => 'Test description',
        'agent_name' => 'Agent',
        'agent_phone' => '0000000000',
        'agent_email' => 'agent@test.com',
        'images' => json_encode(['placeholder.jpg']),
        'amenities' => json_encode([]),
        'status' => 'approved',
    ]);

    // add five views, two from same IP within 24h -> only count unique
    ListingView::create(['rental_id' => $rent->id, 'ip' => '1.1.1.1']);
    ListingView::create(['rental_id' => $rent->id, 'ip' => '1.1.1.1', 'created_at' => now()->subHours(23)]);
    ListingView::create(['rental_id' => $rent->id, 'ip' => '2.2.2.2']);
    ListingView::create(['rental_id' => $rent->id, 'ip' => '3.3.3.3', 'created_at' => now()->subDays(10)]); // outside 7 day window

    ListingInquiry::create(['rental_id' => $rent->id, 'type' => 'phone']);
    ListingInquiry::create(['rental_id' => $rent->id, 'type' => 'form']);

    expect($this->service->getTotalViews($rent))->toBe(4);
    expect($this->service->getUniqueViewsLastDays($rent, 7))->toBe(3);
    expect($this->service->getTotalInquiries($rent))->toBe(2);
    expect($this->service->getConversionRate($rent))->toBe(50.0);
    expect($this->service->getPerformanceScore($rent))->toBe(4 + 2 * 3);
});
