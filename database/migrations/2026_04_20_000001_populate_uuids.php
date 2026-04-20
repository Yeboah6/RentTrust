<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Populate users table with UUIDs
        $users = DB::table('users')->whereNull('user_id')->get();
        foreach ($users as $user) {
            DB::table('users')
                ->where('id', $user->id)
                ->update(['user_id' => Str::uuid()->toString()]);
        }

        // Populate rentals table with UUIDs
        $rentals = DB::table('rentals')->whereNull('rental_id')->get();
        foreach ($rentals as $rental) {
            DB::table('rentals')
                ->where('id', $rental->id)
                ->update(['rental_id' => Str::uuid()->toString()]);
        }

        // Populate reports table with UUIDs
        $reports = DB::table('reports')->whereNull('report_id')->get();
        foreach ($reports as $report) {
            DB::table('reports')
                ->where('id', $report->id)
                ->update(['report_id' => Str::uuid()->toString()]);
        }

        // Populate reviews table with UUIDs
        $reviews = DB::table('reviews')->whereNull('review_id')->get();
        foreach ($reviews as $review) {
            DB::table('reviews')
                ->where('id', $review->id)
                ->update(['review_id' => Str::uuid()->toString()]);
        }

        // Populate verification_requests table with UUIDs
        $verificationRequests = DB::table('verification_requests')->whereNull('verification_request_id')->get();
        foreach ($verificationRequests as $vr) {
            DB::table('verification_requests')
                ->where('id', $vr->id)
                ->update(['verification_request_id' => Str::uuid()->toString()]);
        }

        // Populate subscriptions table with UUIDs
        $subscriptions = DB::table('subscriptions')->whereNull('subscription_uuid')->get();
        foreach ($subscriptions as $sub) {
            DB::table('subscriptions')
                ->where('id', $sub->id)
                ->update(['subscription_uuid' => Str::uuid()->toString()]);
        }

        // Populate payments table with UUIDs
        $payments = DB::table('payments')->whereNull('payment_id')->get();
        foreach ($payments as $payment) {
            DB::table('payments')
                ->where('id', $payment->id)
                ->update(['payment_id' => Str::uuid()->toString()]);
        }

        // Populate plans table with UUIDs
        $plans = DB::table('plans')->whereNull('plan_id')->get();
        foreach ($plans as $plan) {
            DB::table('plans')
                ->where('id', $plan->id)
                ->update(['plan_id' => Str::uuid()->toString()]);
        }

        // Populate listing_views table with UUIDs
        $listingViews = DB::table('listing_views')->whereNull('listing_view_id')->get();
        foreach ($listingViews as $view) {
            DB::table('listing_views')
                ->where('id', $view->id)
                ->update(['listing_view_id' => Str::uuid()->toString()]);
        }

        // Populate listing_inquiries table with UUIDs
        $listingInquiries = DB::table('listing_inquiries')->whereNull('listing_inquiry_id')->get();
        foreach ($listingInquiries as $inquiry) {
            DB::table('listing_inquiries')
                ->where('id', $inquiry->id)
                ->update(['listing_inquiry_id' => Str::uuid()->toString()]);
        }

        // Populate property_types table with UUIDs
        $propertyTypes = DB::table('property_types')->whereNull('property_type_id')->get();
        foreach ($propertyTypes as $pt) {
            DB::table('property_types')
                ->where('id', $pt->id)
                ->update(['property_type_id' => Str::uuid()->toString()]);
        }

        // Populate locations table with UUIDs
        $locations = DB::table('locations')->whereNull('location_id')->get();
        foreach ($locations as $location) {
            DB::table('locations')
                ->where('id', $location->id)
                ->update(['location_id' => Str::uuid()->toString()]);
        }

        // Populate amenities table with UUIDs
        $amenities = DB::table('amenities')->whereNull('amenity_id')->get();
        foreach ($amenities as $amenity) {
            DB::table('amenities')
                ->where('id', $amenity->id)
                ->update(['amenity_id' => Str::uuid()->toString()]);
        }

        // Populate subscription_audit_logs table with UUIDs
        $auditLogs = DB::table('subscription_audit_logs')->whereNull('subscription_audit_log_id')->get();
        foreach ($auditLogs as $log) {
            DB::table('subscription_audit_logs')
                ->where('id', $log->id)
                ->update(['subscription_audit_log_id' => Str::uuid()->toString()]);
        }

        // Populate admin_audit_logs table with UUIDs
        $adminAuditLogs = DB::table('admin_audit_logs')->whereNull('admin_audit_log_id')->get();
        foreach ($adminAuditLogs as $log) {
            DB::table('admin_audit_logs')
                ->where('id', $log->id)
                ->update(['admin_audit_log_id' => Str::uuid()->toString()]);
        }

        // Populate password_reset_tokens table with token_id if it exists
        if (Schema::hasColumn('password_reset_tokens', 'token_id')) {
            $tokens = DB::table('password_reset_tokens')->whereNull('token_id')->get();
            foreach ($tokens as $token) {
                // For password reset tokens, we can't have a good unique identifier since there's no id column
                // So we'll generate a UUID and use it as token_id
                DB::table('password_reset_tokens')
                    ->where('email', $token->email)
                    ->where('token', $token->token)
                    ->update(['token_id' => Str::uuid()->toString()]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // The reverse is handled by the previous migration's down() method
    }
};
