<?php

namespace App\Services;

use App\Gateways\GatewayResolver;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentService
{
    /**
     * Initiate payment checkout.
     * $attemptedProviders prevents infinite fallback recursion.
     */
    public function initiate(User $user, Plan $plan, string $provider = 'paystack', array $attemptedProviders = []): array
    {
        if ($plan->isFree()) {
            return $this->activateFree($user, $plan);
        }

        if (in_array($provider, $attemptedProviders)) {
            throw new \RuntimeException("All payment providers failed. Last attempted: {$provider}");
        }

        $attemptedProviders[] = $provider;
        $reference = 'RT-' . strtoupper(Str::random(16));

        $payment = Payment::create([
            'user_id'   => $user->id,
            'reference' => $reference,
            'provider'  => $provider,
            'amount'    => $plan->price,
            'currency'  => $plan->currency ?? 'GHS',
            'status'    => 'pending',
        ]);

        try {
            $gateway  = GatewayResolver::resolve($provider);
            $response = $gateway->initialize([
                'email'     => $user->email,
                'amount'    => $plan->price,
                'reference' => $reference,
                'user_id'   => $user->id,
                'plan_id'   => $plan->id,
                'plan_name' => $plan->name,
                'name'      => $user->name,
            ]);

            return [
                'success'           => true,
                'payment_id'        => $payment->id,
                'reference'         => $reference,
                'authorization_url' => $response['data']['authorization_url'],
                'provider'          => $provider,
            ];

        } catch (\Throwable $e) {
            Log::error("Payment init failed [{$provider}]", [
                'error'   => $e->getMessage(),
                'user_id' => $user->id,
                'plan_id' => $plan->id,
            ]);

            $payment->update([
                'status'         => 'failed',
                'failure_reason' => $e->getMessage(),
            ]);

            $fallback = GatewayResolver::fallback($provider);

            if (! in_array($fallback, $attemptedProviders)) {
                Log::info("Falling back to {$fallback}");
                return $this->initiate($user, $plan, $fallback, $attemptedProviders);
            }

            throw new \RuntimeException(
                "Payment failed on all providers. Please try again later.",
                0,
                $e
            );
        }
    }

    /**
     * Confirm payment from webhook.
     * This is the ONLY place subscriptions become active from a paid plan.
     * Also syncs user->package so the users table stays in sync.
     */
    public function confirm(string $reference, array $payload, string $provider): void
    {
        DB::transaction(function () use ($reference, $payload, $provider) {
            $payment = Payment::where('reference', $reference)
                ->lockForUpdate()
                ->firstOrFail();

            // Idempotency — skip if already processed
            if ($payment->status === 'success') {
                Log::info('Payment already confirmed, skipping', ['reference' => $reference]);
                return;
            }

            $payment->update([
                'status'      => 'success',
                'raw_payload' => $payload,
            ]);

            $meta   = $payload['data']['metadata'] ?? [];
            $planId = $meta['plan_id'] ?? null;

            if (! $planId) {
                Log::error('No plan_id in payment metadata', ['reference' => $reference]);
                return;
            }

            $plan = Plan::findOrFail($planId);

            $subscription = Subscription::updateOrCreate(
                ['user_id' => $payment->user_id],
                [
                    'plan_id'       => $plan->id,
                    'provider'      => $provider,
                    'status'        => 'active',
                    'starts_at'     => now(),
                    'ends_at'       => now()->addMonth(),
                    'grace_ends_at' => now()->addMonth()->addDays(3),
                    'retry_count'   => 0,
                ]
            );

            $payment->update(['subscription_id' => $subscription->id]);

            // ── Sync user->package ────────────────────────────────────────────
            // Keep users table in sync so existing package-based checks still work
            User::where('id', $payment->user_id)
                ->update(['package' => $plan->slug]);

            Log::info('Subscription activated, package synced', [
                'user_id'         => $payment->user_id,
                'plan'            => $plan->slug,
                'subscription_id' => $subscription->id,
            ]);
        });
    }

    /**
     * Activate free plan instantly — no gateway involved.
     * Also syncs user->package.
     */
    public function activateFree(User $user, Plan $plan): array
    {
        Subscription::updateOrCreate(
            ['user_id' => $user->id],
            [
                'plan_id'       => $plan->id,
                'provider'      => 'none',
                'status'        => 'active',
                'starts_at'     => now(),
                'ends_at'       => null,  // free never expires
                'grace_ends_at' => null,
            ]
        );

        // Sync users.package column
        $user->package = $plan->slug;
        $user->save();

        return [
            'success'  => true,
            'free'     => true,
            'redirect' => route('agent.dashboard'),
        ];
    }

    /**
     * Cancel a user's active subscription.
     * Caller is responsible for downgrading package if needed.
     */
    public function cancel(User $user): bool
    {
        $subscription = $user->subscription;

        if (! $subscription || ! $subscription->isActive()) {
            return false;
        }

        try {
            if ($subscription->provider_subscription_id) {
                $gateway = GatewayResolver::resolve($subscription->provider);
                $gateway->cancelSubscription($subscription->provider_subscription_id);
            }
        } catch (\Throwable $e) {
            Log::warning('Gateway cancel failed, cancelling locally anyway', [
                'error' => $e->getMessage(),
            ]);
        }

        $subscription->update(['status' => 'cancelled']);

        return true;
    }

    /**
     * Manually verify a payment reference (callback fallback).
     */
    public function verifyAndConfirm(string $reference, string $provider): bool
    {
        try {
            $gateway  = GatewayResolver::resolve($provider);
            $response = $gateway->verify($reference);

            if (($response['data']['status'] ?? '') === 'success') {
                $this->confirm($reference, $response, $provider);
                return true;
            }

            return false;

        } catch (\Throwable $e) {
            Log::error('Manual verification failed', [
                'reference' => $reference,
                'error'     => $e->getMessage(),
            ]);
            return false;
        }
    }
}