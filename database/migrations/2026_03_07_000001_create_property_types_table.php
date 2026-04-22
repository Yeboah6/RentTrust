<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('property_types', function (Blueprint $table) {
            $table->id();
            $table->uuid('property_type_id')->unique();
            $table->string('name');
            $table->string('slug')->nullable();
            $table->string('description')->nullable();
            $table->boolean('is_active');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('property_types');
    }
};
