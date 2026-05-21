<?php

namespace Database\Factories;

use App\Models\VerificationRequest;
use App\Models\Rental;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Ramsey\Uuid\Uuid;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VerificationRequest>
 */
class VerificationRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'verification_request_id' => Uuid::uuid4()->toString(),
            'rental_id' => Rental::factory(),
            'agent_id' => User::factory()->agent(),
            'user_id' => User::factory()->agent(),
            'agent_name' => $this->faker->name(),
            'request_type' => $this->faker->randomElement(['initial_verification', 're_verification']),
            'status' => 'pending',
            'proof_documents' => json_encode([]),
            'ownership_documents' => json_encode([]),
            'license_documents' => json_encode([]),
            'utility_bills' => json_encode([]),
            'additional_notes' => $this->faker->paragraph(),
            'admin_notes' => null,
            'rejection_reason' => null,
            'submitted_at' => now(),
            'reviewed_at' => null,
        ];
    }

    /**
     * State: pending verification
     */
    public function pending(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'pending',
            'admin_notes' => null,
            'rejection_reason' => null,
            'reviewed_at' => null,
        ]);
    }

    /**
     * State: approved verification
     */
    public function approved(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'approved',
            'admin_notes' => 'Documents verified and approved.',
            'rejection_reason' => null,
            'reviewed_at' => now()->subDays(rand(1, 10)),
        ]);
    }

    /**
     * State: rejected verification
     */
    public function rejected(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'rejected',
            'admin_notes' => 'See rejection reason below.',
            'rejection_reason' => 'Documents are incomplete or unclear.',
            'reviewed_at' => now()->subDays(rand(1, 10)),
        ]);
    }

    /**
     * With specific rental
     */
    public function forRental(Rental $rental): static
    {
        return $this->state(fn(array $attributes) => [
            'rental_id' => $rental->id,
        ]);
    }

    /**
     * With specific agent
     */
    public function forAgent(User $agent): static
    {
        return $this->state(fn(array $attributes) => [
            'agent_id' => $agent->id,
            'user_id' => $agent->id,
            'agent_name' => $agent->fullName ?? $agent->name,
        ]);
    }

    /**
     * With documents
     */
    public function withDocuments(): static
    {
        return $this->state(fn(array $attributes) => [
            'proof_documents' => json_encode([
                [
                    'original_name' => 'property_deed.pdf',
                    'filename' => 'property_deed_1234567890.pdf',
                    'path' => 'verification_requests/uuid/proof_docs/property_deed_1234567890.pdf',
                    'url' => '/storage/verification_requests/uuid/proof_docs/property_deed_1234567890.pdf',
                    'mime_type' => 'application/pdf',
                    'size' => 524288,
                    'uploaded_at' => now()->toIso8601String(),
                ],
            ]),
            'ownership_documents' => json_encode([
                [
                    'original_name' => 'property_photo.jpg',
                    'filename' => 'property_photo_1234567890.jpg',
                    'path' => 'verification_requests/uuid/ownership_docs/property_photo_1234567890.jpg',
                    'url' => '/storage/verification_requests/uuid/ownership_docs/property_photo_1234567890.jpg',
                    'mime_type' => 'image/jpeg',
                    'size' => 2097152,
                    'uploaded_at' => now()->toIso8601String(),
                ],
            ]),
            'utility_bills' => json_encode([
                [
                    'original_name' => 'utility_bill.pdf',
                    'filename' => 'utility_bill_1234567890.pdf',
                    'path' => 'verification_requests/uuid/utility_bills/utility_bill_1234567890.pdf',
                    'url' => '/storage/verification_requests/uuid/utility_bills/utility_bill_1234567890.pdf',
                    'mime_type' => 'application/pdf',
                    'size' => 1048576,
                    'uploaded_at' => now()->toIso8601String(),
                ],
            ]),
        ]);
    }
}