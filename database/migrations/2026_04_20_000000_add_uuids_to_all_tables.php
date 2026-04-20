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
        // Add user_id to users table
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'user_id')) {
                $table->uuid('user_id')->unique()->after('id');
            }
        });

        // Add rental_id to rentals table
        Schema::table('rentals', function (Blueprint $table) {
            if (!Schema::hasColumn('rentals', 'rental_id')) {
                $table->uuid('rental_id')->unique()->after('id');
            }
        });

        // Add report_id to reports table
        Schema::table('reports', function (Blueprint $table) {
            if (!Schema::hasColumn('reports', 'report_id')) {
                $table->uuid('report_id')->unique()->after('id');
            }
        });

        // Add review_id to reviews table
        Schema::table('reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('reviews', 'review_id')) {
                $table->uuid('review_id')->unique()->after('id');
            }
        });

        // Add verification_request_id to verification_requests table
        Schema::table('verification_requests', function (Blueprint $table) {
            if (!Schema::hasColumn('verification_requests', 'verification_request_id')) {
                $table->uuid('verification_request_id')->unique()->after('id');
            }
        });

        // Add subscription_id column (as uuid) to subscriptions table
        Schema::table('subscriptions', function (Blueprint $table) {
            if (!Schema::hasColumn('subscriptions', 'subscription_uuid')) {
                $table->uuid('subscription_uuid')->unique()->after('id');
            }
        });

        // Add payment_id to payments table
        Schema::table('payments', function (Blueprint $table) {
            if (!Schema::hasColumn('payments', 'payment_id')) {
                $table->uuid('payment_id')->unique()->after('id');
            }
        });

        // Add plan_id to plans table
        Schema::table('plans', function (Blueprint $table) {
            if (!Schema::hasColumn('plans', 'plan_id')) {
                $table->uuid('plan_id')->unique()->after('id');
            }
        });

        // Add listing_view_id to listing_views table
        Schema::table('listing_views', function (Blueprint $table) {
            if (!Schema::hasColumn('listing_views', 'listing_view_id')) {
                $table->uuid('listing_view_id')->unique()->after('id');
            }
        });

        // Add listing_inquiry_id to listing_inquiries table
        Schema::table('listing_inquiries', function (Blueprint $table) {
            if (!Schema::hasColumn('listing_inquiries', 'listing_inquiry_id')) {
                $table->uuid('listing_inquiry_id')->unique()->after('id');
            }
        });

        // Add property_type_id to property_types table
        Schema::table('property_types', function (Blueprint $table) {
            if (!Schema::hasColumn('property_types', 'property_type_id')) {
                $table->uuid('property_type_id')->unique()->after('id');
            }
        });

        // Add location_id to locations table
        Schema::table('locations', function (Blueprint $table) {
            if (!Schema::hasColumn('locations', 'location_id')) {
                $table->uuid('location_id')->unique()->after('id');
            }
        });

        // Add amenity_id to amenities table
        Schema::table('amenities', function (Blueprint $table) {
            if (!Schema::hasColumn('amenities', 'amenity_id')) {
                $table->uuid('amenity_id')->unique()->after('id');
            }
        });

        // Add subscription_audit_log_id to subscription_audit_logs table
        Schema::table('subscription_audit_logs', function (Blueprint $table) {
            if (!Schema::hasColumn('subscription_audit_logs', 'subscription_audit_log_id')) {
                $table->uuid('subscription_audit_log_id')->unique()->after('id');
            }
        });

        // Add admin_audit_log_id to admin_audit_logs table
        Schema::table('admin_audit_logs', function (Blueprint $table) {
            if (!Schema::hasColumn('admin_audit_logs', 'admin_audit_log_id')) {
                $table->uuid('admin_audit_log_id')->unique()->after('id');
            }
        });

        // Add password_reset_token_id to password_reset_tokens table
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            if (!Schema::hasColumn('password_reset_tokens', 'id')) {
                $table->uuid('id')->primary();
            }
            if (!Schema::hasColumn('password_reset_tokens', 'token_id')) {
                $table->uuid('token_id')->unique()->after('id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove all UUID columns
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'user_id')) {
                $table->dropColumn('user_id');
            }
        });

        Schema::table('rentals', function (Blueprint $table) {
            if (Schema::hasColumn('rentals', 'rental_id')) {
                $table->dropColumn('rental_id');
            }
        });

        Schema::table('reports', function (Blueprint $table) {
            if (Schema::hasColumn('reports', 'report_id')) {
                $table->dropColumn('report_id');
            }
        });

        Schema::table('reviews', function (Blueprint $table) {
            if (Schema::hasColumn('reviews', 'review_id')) {
                $table->dropColumn('review_id');
            }
        });

        Schema::table('verification_requests', function (Blueprint $table) {
            if (Schema::hasColumn('verification_requests', 'verification_request_id')) {
                $table->dropColumn('verification_request_id');
            }
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            if (Schema::hasColumn('subscriptions', 'subscription_uuid')) {
                $table->dropColumn('subscription_uuid');
            }
        });

        Schema::table('payments', function (Blueprint $table) {
            if (Schema::hasColumn('payments', 'payment_id')) {
                $table->dropColumn('payment_id');
            }
        });

        Schema::table('plans', function (Blueprint $table) {
            if (Schema::hasColumn('plans', 'plan_id')) {
                $table->dropColumn('plan_id');
            }
        });

        Schema::table('listing_views', function (Blueprint $table) {
            if (Schema::hasColumn('listing_views', 'listing_view_id')) {
                $table->dropColumn('listing_view_id');
            }
        });

        Schema::table('listing_inquiries', function (Blueprint $table) {
            if (Schema::hasColumn('listing_inquiries', 'listing_inquiry_id')) {
                $table->dropColumn('listing_inquiry_id');
            }
        });

        Schema::table('property_types', function (Blueprint $table) {
            if (Schema::hasColumn('property_types', 'property_type_id')) {
                $table->dropColumn('property_type_id');
            }
        });

        Schema::table('locations', function (Blueprint $table) {
            if (Schema::hasColumn('locations', 'location_id')) {
                $table->dropColumn('location_id');
            }
        });

        Schema::table('amenities', function (Blueprint $table) {
            if (Schema::hasColumn('amenities', 'amenity_id')) {
                $table->dropColumn('amenity_id');
            }
        });

        Schema::table('subscription_audit_logs', function (Blueprint $table) {
            if (Schema::hasColumn('subscription_audit_logs', 'subscription_audit_log_id')) {
                $table->dropColumn('subscription_audit_log_id');
            }
        });

        Schema::table('admin_audit_logs', function (Blueprint $table) {
            if (Schema::hasColumn('admin_audit_logs', 'admin_audit_log_id')) {
                $table->dropColumn('admin_audit_log_id');
            }
        });

        Schema::table('password_reset_tokens', function (Blueprint $table) {
            if (Schema::hasColumn('password_reset_tokens', 'token_id')) {
                $table->dropColumn('token_id');
            }
        });
    }
};
