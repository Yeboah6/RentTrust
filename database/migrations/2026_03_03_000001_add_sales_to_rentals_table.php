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
        Schema::table('rentals', function (Blueprint $table) {
            // Add purpose column to distinguish between rental and sale listings
            $table->enum('purpose', ['rent', 'sale'])->default('rent')->after('property_type');
            
            // Add sale-specific pricing
            $table->decimal('sale_price', 15, 2)->nullable()->after('rent_max');
            
            // Track when sale was completed
            $table->boolean('is_sold')->default(false)->after('is_claimed');
            $table->timestamp('sold_at')->nullable()->after('is_sold');
            
            // Add indexes for better query performance
            $table->index('purpose');
            $table->index('is_sold');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rentals', function (Blueprint $table) {
            $table->dropIndex(['purpose']);
            $table->dropIndex(['is_sold']);
            $table->dropColumn(['purpose', 'sale_price', 'is_sold', 'sold_at']);
        });
    }
};
