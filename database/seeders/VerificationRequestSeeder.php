<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\VerificationRequest;
use App\Models\Rental;
use App\Models\User;
use Illuminate\Database\Seeder;
use Ramsey\Uuid\Uuid;

class VerificationRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some agents and rentals
        $agents = User::whereHas('roles', fn($q) => $q->where('name', 'agent'))->limit(5)->get();
        $rentals = Rental::limit(10)->get();

        if ($agents->isEmpty() || $rentals->isEmpty()) {
            $this->command->warn('No agents or rentals found. Skipping verification request seeding.');
            return;
        }

        $statuses = ['pending', 'approved', 'rejected'];

        foreach ($rentals->take(8) as $rental) {
            $agent = $agents->random();
            $status = collect($statuses)->random();

            VerificationRequest::create([
                'verification_request_id' => Uuid::uuid4()->toString(),
                'rental_id' => $rental->id,
                'agent_id' => $agent->id,
                'user_id' => $agent->id,
                'agent_name' => $agent->fullName ?? $agent->name,
                'request_type' => collect(['initial_verification', 're_verification'])->random(),
                'status' => $status,
                'proof_documents' => json_encode([]),
                'ownership_documents' => json_encode([]),
                'license_documents' => json_encode([]),
                'utility_bills' => json_encode([]),
                'additional_notes' => 'Test verification request note',
                'admin_notes' => $status === 'pending' ? null : 'Sample admin notes',
                'rejection_reason' => $status === 'rejected' ? 'Documents were incomplete' : null,
                'submitted_at' => now()->subDays(rand(1, 30)),
                'reviewed_at' => $status !== 'pending' ? now()->subDays(rand(0, 10)) : null,
            ]);
        }

        $this->command->info('Verification request seeding completed.');
    }
}