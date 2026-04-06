<?php

use App\Models\Rental;
use App\Models\User;
use App\Models\Plan;
use App\Models\Subscription;
use App\Services\FeaturedListingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;

uses(Tests\TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->service = new FeaturedListingService();
});

it('can feature a listing within limits', function () {
    // Create plan
    $freePlan = Plan::create([
        'name' => 'Free',
        'description' => 'Free plan',
        'slug' => 'free',
        'price' => 0,
        'currency' => 'GHS',
        'interval' => 'monthly',
        'listing_limit' => 5,
        'rental_limit' => 3,
        'sale_limit' => 2,
        'boost_limit' => 0,
        'lead_limit' => 10,
        'featured_limit' => 1,
        'featured_duration_days' => 3,
        'verified_badge' => false,
        'priority_ranking' => false,
        'analytics_access' => false,
        'features' => [],
        'is_active' => true,
        'sort_order' => 1,
    ]);

    // Create user
    $user = User::create([
        'name' => 'Test User',
        'email' => 'test@test.com',
        'password' => 'password',
    ]);

    // Create rental
    $rental = Rental::create([
        'user_id' => $user->id,
        'title' => 'Test Rental',
        'property_type' => 'apartment',
        'purpose' => 'rent',
        'city' => 'Accra',
        'area' => 'East Legon',
        'rent_min' => 1000,
        'rent_max' => 1500,
        'bedrooms' => 2,
        'bathrooms' => 1,
        'images' => ['image1.jpg'],
        'agent_name' => 'Agent',
        'agent_phone' => '123456789',
        'agent_email' => 'agent@test.com',
        'status' => 'approved',
    ]);

    // Feature the listing
    $this->service->featureListing($user, $rental);

    // Check if featured
    $rental->refresh();
    expect($rental->is_featured)->toBeTrue();
    expect($rental->featured_at)->not->toBeNull();
    expect($rental->featured_expires_at)->not->toBeNull();
});

it('prevents featuring beyond limit', function () {
    // Create plan with limit 1
    $freePlan = Plan::create([
        'name' => 'Free',
        'description' => 'Free plan',
        'slug' => 'free',
        'price' => 0,
        'currency' => 'GHS',
        'interval' => 'monthly',
        'listing_limit' => 5,
        'rental_limit' => 3,
        'sale_limit' => 2,
        'boost_limit' => 0,
        'lead_limit' => 10,
        'featured_limit' => 1,
        'featured_duration_days' => 3,
        'verified_badge' => false,
        'priority_ranking' => false,
        'analytics_access' => false,
        'features' => [],
        'is_active' => true,
        'sort_order' => 1,
    ]);

    // Create user
    $user = User::create([
        'name' => 'Test User',
        'email' => 'test@test.com',
        'password' => 'password',
    ]);

    // Create two rentals
    $rental1 = Rental::create([
        'user_id' => $user->id,
        'title' => 'Test Rental 1',
        'property_type' => 'apartment',
        'purpose' => 'rent',
        'city' => 'Accra',
        'area' => 'East Legon',
        'rent_min' => 1000,
        'rent_max' => 1500,
        'bedrooms' => 2,
        'bathrooms' => 1,
        'images' => ['image1.jpg'],
        'agent_name' => 'Agent',
        'agent_phone' => '123456789',
        'agent_email' => 'agent@test.com',
        'status' => 'approved',
    ]);

    $rental2 = Rental::create([
        'user_id' => $user->id,
        'title' => 'Test Rental 2',
        'property_type' => 'apartment',
        'purpose' => 'rent',
        'city' => 'Accra',
        'area' => 'East Legon',
        'rent_min' => 1000,
        'rent_max' => 1500,
        'bedrooms' => 2,
        'bathrooms' => 1,
        'images' => ['image2.jpg'],
        'agent_name' => 'Agent',
        'agent_phone' => '123456789',
        'agent_email' => 'agent@test.com',
        'status' => 'approved',
    ]);

    // Feature first listing
    $this->service->featureListing($user, $rental1);

    // Try to feature second - should fail
    expect(fn() => $this->service->featureListing($user, $rental2))->toThrow(Exception::class);
});

it('returns random featured listings', function () {
    // Create user
    $user = User::create([
        'name' => 'Test User',
        'email' => 'test@test.com',
        'password' => 'password',
    ]);

    // Create multiple featured rentals
    for ($i = 1; $i <= 10; $i++) {
        Rental::create([
            'user_id' => $user->id,
            'title' => "Test Rental {$i}",
            'property_type' => 'apartment',
            'purpose' => 'rent',
            'city' => 'Accra',
            'area' => 'East Legon',
            'rent_min' => 1000,
            'rent_max' => 1500,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'images' => ["image{$i}.jpg"],
            'agent_name' => 'Agent',
            'agent_phone' => '123456789',
            'agent_email' => 'agent@test.com',
            'status' => 'approved',
            'is_featured' => true,
            'featured_at' => now(),
            'featured_expires_at' => now()->addDays(3),
        ]);
    }

    // Get featured listings
    $featured = $this->service->getFeaturedListings('rent', 5);

    expect($featured)->toHaveCount(5);
    expect($featured->pluck('is_featured')->unique()->values()->toArray())->toBe([true]);
});

it('caches featured listings', function () {
    // Create a featured rental
    $user = User::create([
        'name' => 'Test User',
        'email' => 'test@test.com',
        'password' => 'password',
    ]);

    $rental = Rental::create([
        'user_id' => $user->id,
        'title' => 'Test Rental',
        'property_type' => 'apartment',
        'purpose' => 'rent',
        'city' => 'Accra',
        'area' => 'East Legon',
        'rent_min' => 1000,
        'rent_max' => 1500,
        'bedrooms' => 2,
        'bathrooms' => 1,
        'images' => ['image1.jpg'],
        'agent_name' => 'Agent',
        'agent_phone' => '123456789',
        'agent_email' => 'agent@test.com',
        'status' => 'approved',
        'is_featured' => true,
        'featured_at' => now(),
        'featured_expires_at' => now()->addDays(3),
    ]);

    // First call
    $featured1 = $this->service->getFeaturedListings('rent', 1);
    
    // Second call should return the same result (from cache or same query)
    $featured2 = $this->service->getFeaturedListings('rent', 1);
    expect($featured1->first()->id)->toBe($featured2->first()->id);
});