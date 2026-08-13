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
        Schema::create('rentals', function (Blueprint $table) {
            $table->id();
            $table->uuid('rental_id')->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->unsignedBigInteger('agent_id')->nullable();
            $table->foreign('agent_id')->references('id')->on('users')->onDelete('set null');
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('property_type');
            $table->string('city');
            $table->string('area');
            $table->text('address')->nullable();
            $table->decimal('rent_min', 10, 2)->nullable();
            $table->decimal('rent_max', 10, 2)->nullable();
            $table->integer('advance_duration')->nullable();
            $table->integer('bedrooms');
            $table->integer('bathrooms')->default(0);
            $table->json('amenities')->nullable();
            $table->text('description')->nullable();
            $table->json('images')->nullable();
            $table->string('agent_name');
            $table->string('agent_phone');
            $table->string('agent_email');
            $table->enum('status', ['active', 'inactive', 'rented', 'sold'])->default('active');
            $table->string('verification_status')->default('pending');
            $table->boolean('is_verified')->default(false);
            $table->enum('purpose', ['rent', 'sale'])->default('rent');
            $table->decimal('sale_price', 15, 2)->nullable();

            // Track when sale was completed
            $table->boolean('is_sold')->default(false);
            $table->boolean('is_rented')->default(false);
            $table->timestamp('sold_at')->nullable();
            $table->timestamp('rented_at')->nullable();
            $table->timestamp('verification_rejected_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->text('verification_rejection_reason')->nullable();
            $table->timestamps();

            $table->index(['city', 'area']);
            $table->index(['rent_min', 'rent_max']);
            $table->index('purpose');
            $table->index('is_sold');
            $table->index('is_rented');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rentals');
    }
};