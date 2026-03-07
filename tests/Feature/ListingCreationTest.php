<?php

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;

uses(DatabaseMigrations::class);

beforeEach(function () {
    // disable middleware so we can focus on validation logic
    $this->withoutMiddleware();

    // create a default user used in tests
    $this->user = User::factory()->create();
});

it('allows creating a rental listing with advance duration', function () {
    $response = $this->actingAs($this->user)->post('/rent', [
        'purpose' => 'rent',
        'title' => 'Modern Apartment',
        'propertyType' => 'Apartment',
        'city' => 'Accra',
        'area' => 'East Legon',
        'rentMin' => 1000,
        'rentMax' => 2000,
        'advanceDuration' => 2,
        'bedrooms' => 2,
        'agentName' => 'Agent Smith',
        'agentPhone' => '0244000000',
        'agentEmail' => 'agent@example.com',
    ]);

    // rental listing should be created without validation errors
    $response->assertSessionHasNoErrors();
});

it('allows creating a sale listing without advance duration', function () {
    $response = $this->actingAs($this->user)->post('/rent', [
        'purpose' => 'sale',
        'title' => 'Cozy Bungalow',
        'propertyType' => 'House',
        'city' => 'Kumasi',
        'area' => 'Asafo',
        'salePrice' => 150000,
        'bedrooms' => 3,
        'agentName' => 'Jane Doe',
        'agentPhone' => '0244111111',
        'agentEmail' => 'jane@example.com',
    ]);

    $response->assertSessionHasNoErrors();
    // also ensure advanceDuration is not in input data stored
    $this->assertDatabaseMissing('rentals', ['title' => 'Cozy Bungalow', 'advance_duration' => 1]);
});

it('blocks creation when rental limit has been reached', function () {
    // give user a plan with rental limit 1
    $plan = \App\Models\Plan::factory()->create(['rental_limit' => 1, 'sale_limit' => null]);
    $this->user->subscriptions()->create(['plan_id' => $plan->id, 'status' => 'active', 'ends_at' => now()->addMonth()]);

    // first rental should succeed
    $first = $this->actingAs($this->user)->post('/rent', [
        'purpose' => 'rent',
        'title' => 'First Listing',
        'propertyType' => 'Apartment',
        'city' => 'Accra',
        'area' => 'Cantonments',
        'rentMin' => 500,
        'rentMax' => 700,
        'advanceDuration' => 1,
        'bedrooms' => 1,
        'agentName' => 'Agent A',
        'agentPhone' => '0244000001',
        'agentEmail' => 'a@example.com',
    ]);
    $first->assertSessionHasNoErrors();

    // second rental should be blocked
    $second = $this->actingAs($this->user)->post('/rent', [
        'purpose' => 'rent',
        'title' => 'Second Listing',
        'propertyType' => 'Apartment',
        'city' => 'Accra',
        'area' => 'Cantonments',
        'rentMin' => 800,
        'rentMax' => 1000,
        'advanceDuration' => 1,
        'bedrooms' => 1,
        'agentName' => 'Agent B',
        'agentPhone' => '0244000002',
        'agentEmail' => 'b@example.com',
    ]);
    $second->assertSessionHasErrors();
});

it('blocks creation when sale limit has been reached', function () {
    // set plan with sale limit 1
    $plan = \App\Models\Plan::factory()->create(['rental_limit' => null, 'sale_limit' => 1]);
    $this->user->subscriptions()->create(['plan_id' => $plan->id, 'status' => 'active', 'ends_at' => now()->addMonth()]);

    $first = $this->actingAs($this->user)->post('/rent', [
        'purpose' => 'sale',
        'title' => 'First Sale',
        'propertyType' => 'House',
        'city' => 'Kumasi',
        'area' => 'Ahodwo',
        'salePrice' => 100000,
        'bedrooms' => 3,
        'agentName' => 'Seller A',
        'agentPhone' => '0244000010',
        'agentEmail' => 'sa@example.com',
    ]);
    $first->assertSessionHasNoErrors();

    $second = $this->actingAs($this->user)->post('/rent', [
        'purpose' => 'sale',
        'title' => 'Second Sale',
        'propertyType' => 'House',
        'city' => 'Kumasi',
        'area' => 'Ahodwo',
        'salePrice' => 120000,
        'bedrooms' => 3,
        'agentName' => 'Seller B',
        'agentPhone' => '0244000011',
        'agentEmail' => 'sb@example.com',
    ]);
    $second->assertSessionHasErrors();
});

