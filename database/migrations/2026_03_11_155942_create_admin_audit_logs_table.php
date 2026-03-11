<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_audit_logs', function (Blueprint $table) {
            $table->id();

            // Who performed the action
            $table->foreignId('causer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('causer_name',  120)->nullable();   // snapshot — survives user deletion
            $table->string('causer_email', 180)->nullable();

            // What happened
            $table->string('action',        200);              // human-readable label
            $table->string('type',           40)->index();     // enum-like: subscription|payment|…
            $table->string('affected_user', 160)->nullable();  // display name of affected entity
            $table->unsignedBigInteger('affected_id')->nullable()->index();

            // Context
            $table->text('notes')->nullable();
            $table->string('ip_address', 45)->nullable();      // supports IPv6
            $table->json('properties')->nullable();            // extra structured data

            $table->timestamp('created_at')->useCurrent()->index();
            // no updated_at — logs are immutable

            // Useful composite indexes
            $table->index(['causer_id',   'created_at']);
            $table->index(['type',        'created_at']);
            $table->index(['affected_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_audit_logs');
    }
};