<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RentalListingsRouteTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function rent_listings_route_returns_ok()
    {
        // migrate and seed minimal data if necessary
        // using in-memory sqlite for speed
        $this->artisan('migrate:fresh');

        $response = $this->get('/rent/listings');
        $response->assertStatus(200);
    }
}
