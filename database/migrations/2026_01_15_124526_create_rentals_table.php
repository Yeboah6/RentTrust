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
            $table->string('title');
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
            $table->string('images');
            $table->string('agent_name');
            $table->string('agent_phone');
            $table->string('agent_email');
            $table->enum('status', ['pending', 'approved', 'rejected', 'active', 'inactive', 'rented', 'sold'])->default('pending');
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->enum('purpose', ['rent', 'sale'])->default('rent');
            $table->decimal('sale_price', 15, 2)->nullable();

            $table->boolean('is_featured_queued')->default(false);
            $table->integer('featured_queue_position')->nullable();
            $table->timestamp('queued_at')->nullable();
            $table->integer('times_featured')->default(0);
            $table->timestamp('last_featured_at')->nullable();

            $table->timestamp('featured_at')->nullable();
            $table->timestamp('featured_expires_at');
            $table->integer('featured_priority')->default(0);
            
            // Track when sale was completed
            $table->boolean('is_sold')->default(false);
            $table->boolean('is_rented')->default(false);
            $table->timestamp('sold_at')->nullable();
            $table->timestamp('rented_at')->nullable();
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
