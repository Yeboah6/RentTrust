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
        Schema::create('verification_consents', function (Blueprint $table) {
            $table->id();
            $table->uuid('consent_id')->unique();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('agent_verification_id')->nullable()->constrained('agent_verifications')->cascadeOnDelete();
            $table->string('consent_type');
            $table->string('document_version');
            $table->boolean('accepted')->default(false);
            $table->timestamp('accepted_at')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('withdrawn_at')->nullable();
            $table->index(['user_id','consent_type']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verifiction_consents');
    }
};
