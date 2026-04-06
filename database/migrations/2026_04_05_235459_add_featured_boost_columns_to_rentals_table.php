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
            $table->boolean('is_boosted')->default(false)->after('is_featured');
            $table->timestamp('boost_expires_at')->nullable()->after('is_boosted');
            $table->integer('featured_priority')->default(0)->after('boost_expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rentals', function (Blueprint $table) {
            $table->dropColumn(['is_boosted', 'boost_expires_at', 'featured_priority']);
        });
    }
};
