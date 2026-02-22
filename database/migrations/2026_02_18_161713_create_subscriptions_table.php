<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('subscriptions')) {
            Schema::create('subscriptions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('plan_type');
                $table->decimal('price', 10, 2);
                $table->string('billing_cycle')->default('monthly');
                $table->string('status')->default('active');
                $table->string('provider')->nullable();
                $table->string('provider_subscription_id')->nullable()->unique();
                $table->string('authorization_code')->nullable();
                $table->string('card_type')->nullable();
                $table->string('last_four')->nullable();
                $table->timestamp('next_billing_date')->nullable();
                $table->integer('failed_attempts')->default(0);
                $table->timestamp('last_payment_attempt')->nullable();
                $table->timestamp('starts_at')->nullable();
                $table->timestamp('ends_at')->nullable();
                $table->timestamp('trial_ends_at')->nullable();
                $table->timestamps();
                
                $table->index(['user_id', 'status']);
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('subscriptions');
        // if (Schema::hasTable('subscriptions')) {
        //     Schema::table('subscriptions', function (Blueprint $table) {
        //         $columns = [
        //             'provider_subscription_id',
        //             'provider',
        //             'authorization_code',
        //             'card_type',
        //             'last_four',
        //             'next_billing_date',
        //             'failed_attempts',
        //             'last_payment_attempt'
        //         ];
                
        //         foreach ($columns as $column) {
        //             if (Schema::hasColumn('subscriptions', $column)) {
        //                 $table->dropColumn($column);
        //             }
        //         }
        //     });
        // }
    }
};