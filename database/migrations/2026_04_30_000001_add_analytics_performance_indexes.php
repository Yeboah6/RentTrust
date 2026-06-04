<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop legacy malformed index name if it still exists from an earlier failed run.
        try {
            DB::statement('DROP INDEX IF EXISTS idx_rentals_views');
        } catch (\Throwable) {
            // SQLite may not support DROP INDEX IF EXISTS in every context; ignore and continue.
        }

        // Optimize Rental queries for analytics only when the referenced columns exist.
        Schema::table('rentals', function (Blueprint $table) {
            if (Schema::hasColumn('rentals', 'purpose') && Schema::hasColumn('rentals', 'status')) {
                $table->index(['purpose', 'status'], 'idx_rentals_purpose_status');
            }
            if (Schema::hasColumn('rentals', 'created_at')) {
                $table->index('created_at', 'idx_rentals_created_at');
            }
            if (Schema::hasColumn('rentals', 'city')) {
                $table->index('city', 'idx_rentals_city');
            }
            if (Schema::hasColumn('rentals', 'is_sold')) {
                $table->index('is_sold', 'idx_rentals_is_sold');
            }
            if (Schema::hasColumn('rentals', 'user_id') && Schema::hasColumn('rentals', 'purpose')) {
                $table->index(['user_id', 'purpose'], 'idx_rentals_user_purpose');
            }
        });

        // Optimize ListingInquiry queries for analytics
        Schema::table('listing_inquiries', function (Blueprint $table) {
            $table->index('rental_id', 'idx_inquiries_rental_id');
            $table->index('created_at', 'idx_inquiries_created_at');
        });

        // Optimize User queries for analytics
        Schema::table('users', function (Blueprint $table) {
            $table->index('role', 'idx_users_role');
        });

        // Optimize Subscription queries for analytics
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->index(['user_id', 'status'], 'idx_subscriptions_user_status');
            $table->index('ends_at', 'idx_subscriptions_ends_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rentals', function (Blueprint $table) {
            $table->dropIndex('idx_rentals_purpose_status');
            $table->dropIndex('idx_rentals_created_at');
            $table->dropIndex('idx_rentals_city');
            $table->dropIndex('idx_rentals_is_sold');
            $table->dropIndex('idx_rentals_user_purpose');
        });

        Schema::table('listing_inquiries', function (Blueprint $table) {
            $table->dropIndex('idx_inquiries_rental_id');
            $table->dropIndex('idx_inquiries_created_at');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('idx_users_role');
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropIndex('idx_subscriptions_user_status');
            $table->dropIndex('idx_subscriptions_ends_at');
        });
    }
};
