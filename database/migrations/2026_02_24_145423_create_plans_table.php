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
            $table->integer('sale_limit')->nullable()->default(0)->after('listing_limit');
            $table->integer('featured_limit')->default(0)->after('boost_limit');
            $table->integer('featured_duration_days')->default(0)->after('featured_limit');
            $table->timestamps();
        });

        // Seed default plans
        // DB::table('plans')->insert([
        //     [
        //         'name' => 'Free',
        //         'description' => 'Perfect for getting started',  
        //         'features'    => json_encode([                    
        //             'Submit listings to the platform',
        //             'Limited visibility in search results',
        //             'Basic listing management',
        //             'Standard support',
        //         ]),
        //         'slug' => 'free',
        //         'price' => 0,
        //         'currency' => 'GHS',
        //         'interval' => 'monthly',
        //         'listing_limit' => 2,
        //         'boost_limit' => 0,
        //         'lead_limit' => 5,
        //         'verified_badge' => false,
        //         'priority_ranking' => false,
        //         'analytics_access' => false,
        //         'is_active' => true,
        //         'sort_order' => 1,
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'name' => 'Pro',
        //         'description' => 'Build trust and stand out',
        //         'features'    => json_encode([
        //             'Everything in Free, plus:',
        //             'Access to tenant inquiries',
        //             'Verified landlord badge',
        //             'Higher ranking in search results',
        //             'Respond to reviews',
        //             'Dedicated account manager',
        //         ]),
        //         'slug' => 'pro',
        //         'price' => 149.00,
        //         'currency' => 'GHS',
        //         'interval' => 'monthly',
        //         'listing_limit' => 20,
        //         'boost_limit' => 2,
        //         'lead_limit' => 50,
        //         'verified_badge' => true,
        //         'priority_ranking' => false,
        //         'analytics_access' => true,
        //         'is_active' => true,
        //         'sort_order' => 2,
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'name' => 'Elite',
        //         'description' => 'Advanced tools for professionals',
        //         'features'    => json_encode([
        //             'Everything in Pro, plus:',
        //             'Lead unlock credits (200/month)',
        //             'Featured listing placement',
        //         ]),
        //         'slug' => 'elite',
        //         'price' => 249.00,
        //         'currency' => 'GHS',
        //         'interval' => 'monthly',
        //         'listing_limit' => null,
        //         'boost_limit' => 10,
        //         'lead_limit' => 200,
        //         'verified_badge' => true,
        //         'priority_ranking' => true,
        //         'analytics_access' => true,
        //         'is_active' => true,
        //         'sort_order' => 3,
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        // ]);

        // DB::table('plans')->where('slug', 'free')->update(['rental_limit' => 2, 'sale_limit' => 1]);
        // DB::table('plans')->where('slug', 'pro')->update(['rental_limit' => 20, 'sale_limit' => 5]);
        // DB::table('plans')->where('slug', 'elite')->update(['rental_limit' => null, 'sale_limit' => 20]);
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};