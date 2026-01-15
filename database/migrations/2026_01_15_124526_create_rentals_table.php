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
            $table->foreignId('agent_id')->constrained('agents')->onDelete('cascade');
            $table->string('title');
            $table->string('propertyType');
            $table->string('city');
            $table->string('area');
            $table->string('address')->nullable();
            $table->decimal('monthlyRent', 10, 2);
            $table->integer('bedrooms');
            $table->integer('bathrooms');
            $table->integer('advanceDuration');
            $table->text('description')->nullable();
            $table->string('agentName');
            $table->string('agentPhone');
            $table->string('agentEmail');
            $table->json('amenities')->nullable();
            $table->json('images')->nullable();
            $table->timestamps();
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
