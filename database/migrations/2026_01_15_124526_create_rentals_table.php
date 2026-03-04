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
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_claimed')->default(false);
            $table->enum('purpose', ['rent', 'sale'])->default('rent')->after('property_type');
            $table->decimal('sale_price', 15, 2)->nullable()->after('rent_max');
            
            // Track when sale was completed
            $table->boolean('is_sold')->default(false)->after('is_claimed');
            $table->timestamp('sold_at')->nullable()->after('is_sold');
            $table->timestamps();

            $table->index(['city', 'area']);
            $table->index(['rent_min', 'rent_max']);
            $table->index('purpose');
            $table->index('is_sold');
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
