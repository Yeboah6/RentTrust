<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Location;
use Illuminate\Support\Str;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            ['location_id' => (string) Str::uuid(), 'name' => 'Accra', 'slug' => 'accra', 'type' => 'region', 'is_active' => true],
            // ['location_id' => (string) Str::uuid(), 'name' => 'Kumasi', 'slug' => 'kumasi', 'type' => 'region', 'is_active' => true],
            // ['location_id' => (string) Str::uuid(), 'name' => 'Tamale', 'slug' => 'tamale', 'type' => 'region', 'is_active' => true],
            // ['location_id' => (string) Str::uuid(), 'name' => 'Takoradi', 'slug' => 'takoradi', 'type' => 'region', 'is_active' => true],
            // ['location_id' => (string) Str::uuid(), 'name' => 'Tema', 'slug' => 'tema', 'type' => 'city', 'is_active' => true],
        ];

        foreach ($locations as $location) {
            Location::updateOrCreate([  
                'location_id' => $location['location_id'],
            ], $location);
        }
    }
}
