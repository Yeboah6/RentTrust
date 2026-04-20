<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            // Add plan_id column if it doesn't exist
            if (!Schema::hasColumn('plans', 'plan_id')) {
                $table->string('plan_id')->unique()->after('id');
            }
        });

        // Generate unique plan_id for existing records without one
        $plans = DB::table('plans')->whereNull('plan_id')->orWhere('plan_id', '')->get();
        foreach ($plans as $plan) {
            DB::table('plans')
                ->where('id', $plan->id)
                ->update(['plan_id' => 'PLAN-' . strtoupper(bin2hex(random_bytes(6)))]);
        }
    }

    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropUnique(['plan_id']);
            $table->dropColumn('plan_id');
        });
    }
};
