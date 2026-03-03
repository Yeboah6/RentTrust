<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            // Separate limits for rental and sale listings
            $table->integer('rental_limit')->nullable()->change();
            $table->integer('sale_limit')->nullable()->default(0)->after('listing_limit');
        });

        // Update existing plans with appropriate sale limits
        DB::table('plans')->where('slug', 'free')->update(['rental_limit' => 2, 'sale_limit' => 1]);
        DB::table('plans')->where('slug', 'pro')->update(['rental_limit' => 20, 'sale_limit' => 5]);
        DB::table('plans')->where('slug', 'elite')->update(['rental_limit' => null, 'sale_limit' => 20]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn('sale_limit');
            $table->integer('listing_limit')->nullable()->change();
        });
    }
};
