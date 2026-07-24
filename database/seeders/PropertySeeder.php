<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PropertyType;
use Illuminate\Support\Str;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $propertyTypes = [
            ['property_type_id' => (string) Str::uuid(), 'name' => 'Apartment', 'slug' => 'apartment', 'description' => 'A self-contained housing unit that occupies only part of a building.', 'is_active' => true],
            ['property_type_id' => (string) Str::uuid(), 'name' => 'House', 'slug' => 'house', 'description' => 'A standalone residential building that is typically larger than an apartment.', 'is_active' => true],
            ['property_type_id' => (string) Str::uuid(), 'name' => 'Condominium', 'slug' => 'condominium', 'description' => 'A type of residential property where individuals own their units but share common areas.', 'is_active' => true],
            ['property_type_id' => (string) Str::uuid(), 'name' => 'Townhouse', 'slug' => 'townhouse', 'description' => 'A multi-story residential property that shares one or more walls with adjacent properties.', 'is_active' => true],
            ['property_type_id' => (string) Str::uuid(), 'name' => 'Villa', 'slug' => 'villa', 'description' => 'A luxurious and spacious residential property, often located in a scenic area.', 'is_active' => true],
            ['property_type_id' => (string) Str::uuid(), 'name' => 'Self Contained', 'slug' => 'self-contained', 'description' => 'A self-contained residential property with its own kitchen and bathroom.', 'is_active' => true],
            ['property_type_id' => (string) Str::uuid(), 'name' => 'Chamber and Hall', 'slug' => 'chamber-and-hall', 'description' => 'A traditional residential property with separate chambers and a central hall.', 'is_active' => true],
        ];

        foreach ($propertyTypes as $type) {
            PropertyType::updateOrCreate([
                'property_type_id' => $type['property_type_id'],
            ], $type);
        }
    }
}
