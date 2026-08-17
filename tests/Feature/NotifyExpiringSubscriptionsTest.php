<?php

use App\Console\Commands\NotifyExpiringSubscriptions;
use App\Jobs\SendSubscriptionExpiryReminder;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;

uses(RefreshDatabase::class);

it('sends 7-day reminders only for active pro or elite subscriptions and marks them as notified', function () {
    Queue::fake();

    $plan = Plan::create([
        'name' => 'Pro',
        'description' => 'Pro plan',
        'slug' => 'pro',
        'price' => 99.00,
        'currency' => 'GHS',
        'interval' => 'monthly',
        'features' => [],
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $user = \App\Models\User::create([
        'name' => 'Test Agent',
        'email' => 'agent@example.com',
        'phone' => '+233240000000',
        'role' => 'agent',
        'type' => 'Agent',
        'package' => 'pro',
        'password' => bcrypt('password123'),
    ]);

    Subscription::create([
        'user_id' => $user->id,
        'plan_id' => $plan->id,
        'provider' => 'paystack',
        'status' => 'active',
        'starts_at' => now()->subDay(),
        'ends_at' => now()->addDays(7)->setTime(12, 0, 0),
        'grace_ends_at' => now()->addDays(10),
    ]);

    $freePlan = Plan::create([
        'name' => 'Free',
        'description' => 'Free plan',
        'slug' => 'free',
        'price' => 0,
        'currency' => 'GHS',
        'interval' => 'monthly',
        'features' => [],
        'is_active' => true,
        'sort_order' => 2,
    ]);

    Subscription::create([
        'user_id' => $user->id,
        'plan_id' => $freePlan->id,
        'provider' => 'paystack',
        'status' => 'active',
        'starts_at' => now()->subDay(),
        'ends_at' => now()->addDays(7)->setTime(12, 0, 0),
        'grace_ends_at' => now()->addDays(10),
    ]);

    $this->artisan(NotifyExpiringSubscriptions::class)->assertSuccessful();

    Queue::assertPushed(SendSubscriptionExpiryReminder::class, 1);

    $subscription = Subscription::where('plan_id', $plan->id)->first();
    expect($subscription->notified_7_day_at)->not->toBeNull();
});

it('does not resend a reminder for subscriptions already notified', function () {
    Queue::fake();

    $plan = Plan::create([
        'name' => 'Elite',
        'description' => 'Elite plan',
        'slug' => 'elite',
        'price' => 149.00,
        'currency' => 'GHS',
        'interval' => 'monthly',
        'features' => [],
        'is_active' => true,
        'sort_order' => 3,
    ]);

    $user = \App\Models\User::create([
        'name' => 'Another Agent',
        'email' => 'another-agent@example.com',
        'phone' => '+233240000001',
        'role' => 'agent',
        'type' => 'Agent',
        'package' => 'elite',
        'password' => bcrypt('password123'),
    ]);

    $subscription = Subscription::create([
        'user_id' => $user->id,
        'plan_id' => $plan->id,
        'provider' => 'flutterwave',
        'status' => 'active',
        'starts_at' => now()->subDay(),
        'ends_at' => now()->addDays(1)->setTime(12, 0, 0),
        'grace_ends_at' => now()->addDays(4),
        'notified_1_day_at' => now(),
    ]);

    $this->artisan(NotifyExpiringSubscriptions::class)->assertSuccessful();

    Queue::assertNotPushed(SendSubscriptionExpiryReminder::class);
    expect($subscription->fresh()->notified_1_day_at)->not->toBeNull();
});
