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
            $table->index('purpose');
            $table->index('created_at');
            $table->index('city');
            $table->index('area');
            $table->index(['purpose', 'created_at']);
            $table->index(['city', 'area']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rentals', function (Blueprint $table) {
            $table->dropIndex(['purpose']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['city']);
            $table->dropIndex(['area']);
            $table->dropIndex(['purpose', 'created_at']);
            $table->dropIndex(['city', 'area']);
        });
    }
};
