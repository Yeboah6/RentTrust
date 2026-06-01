<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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
            'user_id' => Str::uuid(),
            'name' => 'Rent Trust',
            'email' => 'rent@trust.com',
            'phone' => '0500866048',
            'role' => 'super_admin',
            'status' => 'verified',
            'package' => 'super_admin',
            'password' => Hash::make('RentTrust123'),
        ]);
    }
}
