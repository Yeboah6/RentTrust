<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->string('provider_subscription_id')->nullable()->unique();
            $table->string('provider')->nullable(); // paystack, flutterwave
            $table->string('authorization_code')->nullable();
            $table->string('card_type')->nullable();
            $table->string('last_four')->nullable();
            $table->timestamp('next_billing_date')->nullable();
            $table->integer('failed_attempts')->default(0);
            $table->timestamp('last_payment_attempt')->nullable();
        });
    }

    public function down()
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn([
                'provider_subscription_id',
                'provider',
                'authorization_code',
                'card_type',
                'last_four',
                'next_billing_date',
                'failed_attempts',
                'last_payment_attempt'
            ]);
        });
    }
};