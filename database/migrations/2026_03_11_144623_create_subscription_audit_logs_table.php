<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('subscription_audit_log_id')->unique();
            $table->foreignId('subscription_id')->constrained()->cascadeOnDelete();
            $table->foreignId('admin_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action', 60)->index();   // cancel | suspend | free_month | upgrade | admin_grant …
            $table->text('notes')->nullable();
            $table->json('meta')->nullable();         // arbitrary key-value context
            $table->timestamp('created_at')->useCurrent();
            // no updated_at — audit records are immutable

            $table->index(['subscription_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_audit_logs');
    }
};