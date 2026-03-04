<?php

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;

uses(DatabaseMigrations::class);

beforeEach(function () {
    // disable middleware so we can focus on validation logic
    $this->withoutMiddleware();
});

it('allows creating a rental listing with advance duration', function () {
    $response = $this->post('/rent', [
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
    $response = $this->post('/rent', [
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
