<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('verification_requests')) {
            Schema::create('verification_requests', function (Blueprint $table) {
                $table->id();
                $table->uuid('verification_request_id')->unique();
                $table->foreignId('rental_id')->constrained('rentals')->onDelete('cascade');
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('agent_id');
                $table->string('agent_name');
                $table->enum('request_type', ['initial_verification', 're_verification'])->default('initial_verification');
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
                
                // Document storage (JSON)
                $table->text('proof_documents')->nullable(); // Property ownership/authorization docs
                $table->text('ownership_documents')->nullable(); // Property photos
                $table->text('license_documents')->nullable(); // Agent license (if applicable)
                $table->text('utility_bills')->nullable(); // Utility bills
                
                // Additional information
                $table->text('additional_notes')->nullable();
                $table->text('admin_notes')->nullable(); // Admin review notes
                $table->string('rejection_reason', 500)->nullable();
                
                // Timestamps
                $table->timestamp('submitted_at')->nullable();
                $table->timestamp('reviewed_at')->nullable();
                $table->unsignedBigInteger('reviewed_by')->nullable(); // Admin who reviewed
                
                $table->timestamps();
                
                // Indexes
                $table->index('rental_id');
                $table->index('user_id');
                $table->index('status');
                $table->index('created_at');
            });
        }

        // Add verification columns to rentals table if they don't exist
        Schema::table('rentals', function (Blueprint $table) {
            if (!Schema::hasColumn('rentals', 'verification_status')) {
                $table->enum('verification_status', ['pending', 'verified', 'rejected'])->nullable()->after('status');
            }
            if (!Schema::hasColumn('rentals', 'verification_requested_at')) {
                $table->timestamp('verification_requested_at')->nullable()->after('verification_status');
            }
            if (!Schema::hasColumn('rentals', 'verified_at')) {
                $table->timestamp('verified_at')->nullable()->after('verification_requested_at');
            }
            if (!Schema::hasColumn('rentals', 'is_verified')) {
                $table->boolean('is_verified')->default(false)->after('verified_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verification_requests');
        
        Schema::table('rentals', function (Blueprint $table) {
            $table->dropColumn([
                'verification_status',
                'verification_requested_at',
                'verified_at',
                'is_verified'
            ]);
        });
    }
};