<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PlanSeeder::class,
        ]);

        User::create([
            'name' => 'Rent Trust',
            'email' => 'rent@trust.com',
            'role' => 'super_admin',
            'status' => 'verified',
            'package' => 'super_admin',
            'password' => Hash::make('RentTrust123'),
        ]);
    }
}
