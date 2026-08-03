<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->uuid('plan_id')->unique();
            $table->string('name');
            $table->text('description');
            $table->string('slug')->unique();
            $table->decimal('price', 10, 2)->default(0);
            $table->string('currency')->default('GHS');
            $table->string('interval')->default('monthly'); // monthly, yearly
            $table->integer('listing_limit')->nullable(); // null = unlimited
            $table->integer('boost_limit')->default(0);
            $table->integer('lead_limit')->default(0);
            $table->boolean('verified_badge')->default(false);
            $table->boolean('priority_ranking')->default(false);
            $table->boolean('analytics_access')->default(false);
            $table->json('features');
            $table->string('paystack_plan_code')->nullable();
            $table->string('flutterwave_plan_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->integer('rental_limit')->nullable();
            $table->integer('sale_limit')->nullable()->default(0);
            $table->integer('featured_limit')->default(0);
            $table->integer('featured_duration_days')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};