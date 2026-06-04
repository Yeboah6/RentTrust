<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        try {
            DB::statement('DROP INDEX IF EXISTS idx_rentals_views');
        } catch (\Throwable) {
            // Ignore legacy SQLite index cleanup failures and continue.
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op; this cleanup migration is intentionally safe to rerun.
    }
};
