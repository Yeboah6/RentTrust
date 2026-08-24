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
        Schema::create('identity_verifications', function (Blueprint $table) {
            $table->id();
            $table->uuid('identity_verification_id')->unique();
            $table->foreignId('agent_verification_id')->constrained('agent_verifications')->cascadeOnDelete();
            $table->string('provider');
            $table->string('provider_reference')->nullable()->unique();
            $table->string('provider_subject_id')->nullable()->unique();
            $table->text('national_id_reference')->nullable();
            $table->string('status')->default('pending')->index();
            $table->boolean('biometric_verified')->default(false);
            $table->string('biometric_method')->nullable();
            $table->boolean('liveness_verified')->nullable();
            $table->decimal('match_score', 5, 2)->nullable();
            $table->string('verified_first_name')->nullable();
            $table->string('verified_middle_name')->nullable();
            $table->string('verified_last_name')->nullable();
            $table->date('verified_date_of_birth')->nullable();
            $table->string('verified_gender')->nullable();
            $table->string('failure_code')->nullable();
            $table->text('failure_reason')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->index(['agent_verification_id','status']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('identity_verifications');
    }
};
