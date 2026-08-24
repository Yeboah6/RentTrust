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
        Schema::create('agent_verifications', function (Blueprint $table) {
            $table->id();
            $table->uuid('verification_id')->unique();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('status')->default('pending')->index();
            $table->string('identity_status')->default('not_started')->index();
            $table->timestamp('identity_verified_at')->nullable();
            $table->string('professional_status')->default('not_started')->index();
            $table->timestamp('professional_verified_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->string('risk_level')->nullable();
            $table->unsignedInteger('risk_score') ->nullable();
            $table->boolean('requires_manual_review')->default(false);
            $table->unique('user_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agent_verifications');
    }
};
