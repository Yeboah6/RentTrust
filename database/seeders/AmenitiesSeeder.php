<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Amenity;
use Illuminate\Support\Str;

class AmenitiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $amenities = [
            ['amenity_id' => (string) Str::uuid(), 'name' => 'Air Conditioning', 'description' => 'Air conditioning available in the property.', 'category' => 'indoor', 'is_active' => true],
            ['amenity_id' => (string) Str::uuid(), 'name' => 'Backup Generator', 'description' => 'Backup generator available in the property.', 'category' => 'indoor', 'is_active' => true],
            ['amenity_id' => (string) Str::uuid(), 'name' => 'Central Heating', 'description' => 'Central heating available in the property.', 'category' => 'indoor', 'is_active' => true],
            ['amenity_id' => (string) Str::uuid(), 'name' => 'Dishwasher', 'description' => 'Dishwasher available in the property.', 'category' => 'indoor', 'is_active' => true],
            ['amenity_id' => (string) Str::uuid(), 'name' => 'Fireplace', 'description' => 'Fireplace available in the property.', 'category' => 'indoor', 'is_active' => true],
            ['amenity_id' => (string) Str::uuid(), 'name' => 'Gym', 'description' => 'Gym facility available in the property.', 'category' => 'indoor', 'is_active' => true],
            ['amenity_id' => (string) Str::uuid(), 'name' => 'Furnished', 'description' => 'Furnished property available.', 'category' => 'indoor', 'is_active' => true],
            ['amenity_id' => (string) Str::uuid(), 'name' => 'Internet', 'description' => 'High-speed internet available in the property.', 'category' => 'indoor', 'is_active' => true],
            ['amenity_id' => (string) Str::uuid(), 'name' => 'Parking', 'description' => 'Parking available in the property.', 'category' => 'outdoor', 'is_active' => true],
            ['amenity_id' => (string) Str::uuid(), 'name' => 'Security System', 'description' => 'Security system available in the property.', 'category' => 'indoor', 'is_active' => true],
            ['amenity_id' => (string) Str::uuid(), 'name' => 'Garden', 'description' => 'Garden available in the property.', 'category' => 'outdoor', 'is_active' => true],

        ];

        foreach ($amenities as $amenity) {
            Amenity::updateOrCreate([
                'amenity_id' => $amenity['amenity_id'],
            ], $amenity);
        }
    }
}
