<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->uuid('location_id')->unique();
            $table->string('name');
            $table->string('type');
            $table->string('slug')->nullable();
            $table->boolean('is_active');
            $table->foreignId('parent_id')->nullable()->constrained('locations')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('locations');
    }
};
