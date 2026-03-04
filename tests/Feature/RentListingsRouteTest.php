<?php

use function Pest\Laravel\get;

it('returns 200 for /rent/listings', function () {
    $this->artisan('migrate:fresh');

    get('/rent/listings')->assertStatus(200);
});
