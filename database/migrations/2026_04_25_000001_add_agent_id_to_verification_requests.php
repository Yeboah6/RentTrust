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
        Schema::table('verification_requests', function (Blueprint $table) {
            // Add agent_id if it doesn't exist
            if (!Schema::hasColumn('verification_requests', 'agent_id')) {
                $table->unsignedBigInteger('agent_id')->nullable()->after('user_id');
                $table->foreign('agent_id')->references('id')->on('users')->onDelete('set null');
            }
        });

        // Add additional tracking columns
        Schema::table('verification_requests', function (Blueprint $table) {
            if (!Schema::hasColumn('verification_requests', 'verification_rejected_at')) {
                $table->timestamp('verification_rejected_at')->nullable()->after('reviewed_at');
            }
            if (!Schema::hasColumn('verification_requests', 'rejected_at')) {
                $table->timestamp('rejected_at')->nullable()->after('verification_rejected_at');
            }
        });

        // Add verification-related columns to rentals table if they don't exist
        Schema::table('rentals', function (Blueprint $table) {
            if (!Schema::hasColumn('rentals', 'verification_rejected_at')) {
                $table->timestamp('verification_rejected_at')->nullable();
            }
            if (!Schema::hasColumn('rentals', 'verification_rejection_reason')) {
                $table->text('verification_rejection_reason')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('verification_requests', function (Blueprint $table) {
            if (Schema::hasColumn('verification_requests', 'agent_id')) {
                $table->dropForeign(['agent_id']);
                $table->dropColumn('agent_id');
            }
            if (Schema::hasColumn('verification_requests', 'verification_rejected_at')) {
                $table->dropColumn('verification_rejected_at');
            }
            if (Schema::hasColumn('verification_requests', 'rejected_at')) {
                $table->dropColumn('rejected_at');
            }
        });

        Schema::table('rentals', function (Blueprint $table) {
            if (Schema::hasColumn('rentals', 'verification_rejected_at')) {
                $table->dropColumn('verification_rejected_at');
            }
            if (Schema::hasColumn('rentals', 'verification_rejection_reason')) {
                $table->dropColumn('verification_rejection_reason');
            }
        });
    }
};
