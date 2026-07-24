-- Active: 1781394438181@@127.0.0.1@3306
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rentals', function (Blueprint $table) {
            if (! Schema::hasColumn('rentals', 'slug')) {
                $table->string('slug')->nullable()->after('title')->unique();
            }
        });

        DB::table('rentals')->whereNull('slug')->cursor()->each(function ($rental) {
            DB::table('rentals')->where('id', $rental->id)->update([
                'slug' => Str::slug($rental->title . ' ' . $rental->area . ' ' . $rental->city . ' ' . $rental->id),
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('rentals', function (Blueprint $table) {
            if (Schema::hasColumn('rentals', 'slug')) {
                $table->dropUnique(['slug']);
                $table->dropColumn('slug');
            }
        });
    }
};
