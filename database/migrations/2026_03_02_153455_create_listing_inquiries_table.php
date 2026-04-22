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
        Schema::create('listing_inquiries', function (Blueprint $table) {
            $table->id();
            $table->uuid('listing_inquiry_id')->unique();
            $table->foreignId('rental_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('type', ['whatsapp', 'phone', 'form']);
            $table->text('message')->nullable();
            $table->ipAddress('ip')->nullable();
            $table->timestamps();

            $table->index(['rental_id', 'created_at']);
            $table->index(['type', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listing_inquiries');
    }
};
