<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->string('transaction_id')->nullable()->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->morphs('payable'); // For subscriptions, boosts, lead unlocks
            $table->string('provider'); // paystack, flutterwave
            $table->string('payment_method'); // mtn, vodafone, airteltigo
            $table->string('phone_number');
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('GHS');
            $table->string('status'); // pending, success, failed, expired
            $table->json('metadata')->nullable();
            $table->json('provider_response')->nullable();
            $table->json('verification_response')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'status', 'created_at']);
            $table->index(['reference', 'provider']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');
    }
};