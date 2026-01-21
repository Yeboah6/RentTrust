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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rental_id')->constrained('rentals')->onDelete('cascade');
            $table->json('overall_rating');
            $table->boolean('landlord_responsive')->nullable();
            $table->boolean('property_matched_description')->nullable();
            $table->boolean('fair_pricing')->nullable();
            $table->boolean('good_communication')->nullable();
            $table->string('comments')->nullable();
            $table->string('full_name')->nullable();
            $table->text('response')->nullable();
            $table->string('response_person')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
