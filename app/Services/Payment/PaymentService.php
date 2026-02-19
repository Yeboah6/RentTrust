<?php

namespace App\Services\Payment;

use App\Models\Payment;
use App\Models\PaymentAttempt;
use App\Models\Subscription;
use App\Services\Analytics\PaymentAnalytics;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    protected $gatewayResolver;
    protected $analytics;

    public function __construct(GatewayResolver $gatewayResolver, PaymentAnalytics $analytics)
    {
        $this->gatewayResolver = $gatewayResolver;
        $this->analytics = $analytics;
    }

    /**
     * Initialize a payment
     */
    public function initialize(array $data)
    {
        $provider = $data['provider'] ?? $this->gatewayResolver->getPrimaryProvider();

        // Validate phone number first
        $gateway = $this->gatewayResolver->resolve($provider);
        $validation = $gateway->validatePhoneNumber($data['phone'], $data['payment_method']);

        if (!$validation['valid']) {
            return [
                'success' => false,
                'message' => $validation['message']
            ];
        }

        // Update phone with validated format
        $data['phone'] = $validation['phone'];

        return DB::transaction(function () use ($data, $provider) {
            // Create payment record
            $payment = Payment::create([
                'user_id' => $data['user_id'],
                'payable_type' => $data['payable_type'],
                'payable_id' => $data['payable_id'],
                'provider' => $provider,
                'payment_method' => $data['payment_method'],
                'phone_number' => $data['phone'],
                'amount' => $data['amount'],
                'currency' => $data['currency'] ?? 'GHS',
                'status' => 'pending',
                'metadata' => [
                    'plan_id' => $data['plan_id'] ?? null,
                    'description' => $data['description'] ?? null,
                    'user_agent' => request()->userAgent(),
                    'ip_address' => request()->ip()
                ]
            ]);

            // Log attempt
            $attempt = PaymentAttempt::create([
                'payment_id' => $payment->id,
                'user_id' => $data['user_id'],
                'reference' => $payment->reference,
                'provider' => $provider,
                'status' => 'attempt',
                'request_data' => $data
            ]);

            try {
                // Initialize with gateway
                $gateway = $this->gatewayResolver->resolve($provider);
                $result = $gateway->initialize([
                    'email' => $data['email'],
                    'amount' => $data['amount'],
                    'phone' => $data['phone'],
                    'provider' => $data['payment_method'],
                    'user_id' => $data['user_id'],
                    'reference' => $payment->reference,
                    'payable_type' => $data['payable_type'],
                    'payable_id' => $data['payable_id'],
                    'fullname' => $data['fullname'] ?? $data['email']
                ]);

                if (!$result['success']) {
                    throw new \Exception($result['message']);
                }

                // Update payment with provider reference
                $payment->update([
                    'provider_response' => $result['data']
                ]);

                $attempt->markAsSuccess($result['data']);

                // Track analytics
                $this->analytics->trackInitialization($payment, $provider);

                return [
                    'success' => true,
                    'payment' => $payment,
                    'provider_reference' => $result['provider_reference'],
                    'message' => 'Payment initialized successfully'
                ];

            } catch (\Exception $e) {
                $payment->markAsFailed($e->getMessage());
                $attempt->markAsFailed($e->getMessage());

                Log::error('Payment initialization failed', [
                    'payment_id' => $payment->id,
                    'error' => $e->getMessage()
                ]);

                return [
                    'success' => false,
                    'message' => $e->getMessage()
                ];
            }
        });
    }

    /**
     * Verify a payment
     */
    public function verify(string $reference, ?string $provider = null)
    {
        $payment = Payment::where('reference', $reference)->firstOrFail();
        $provider = $provider ?? $payment->provider;

        try {
            $gateway = $this->gatewayResolver->resolve($provider);
            $result = $gateway->verify($reference);

            if (!$result['success']) {
                throw new \Exception($result['message']);
            }

            return DB::transaction(function () use ($payment, $result) {
                if ($result['status'] === 'success') {
                    $payment->markAsSuccess($result['transaction_id'], $result['provider_response']);
                    
                    // Activate the payable item
                    $this->activatePayable($payment);
                    
                    // Track successful payment
                    $this->analytics->trackSuccess($payment);
                    
                } elseif ($result['status'] === 'failed') {
                    $payment->markAsFailed('Payment failed at provider');
                }

                $payment->update([
                    'verification_response' => $result
                ]);

                return [
                    'success' => true,
                    'payment' => $payment,
                    'status' => $payment->status
                ];
            });

        } catch (\Exception $e) {
            Log::error('Payment verification failed', [
                'reference' => $reference,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Handle webhook
     */
    public function handleWebhook(string $provider, array $payload)
    {
        try {
            $gateway = $this->gatewayResolver->resolve($provider);
            
            // Extract reference based on provider
            $reference = $this->extractReference($provider, $payload);
            
            if (!$reference) {
                throw new \Exception('No reference found in webhook payload');
            }

            $payment = Payment::where('reference', $reference)->first();

            if (!$payment) {
                // Log but don't throw - might be a test webhook
                Log::warning('Payment not found for webhook', [
                    'reference' => $reference,
                    'provider' => $provider
                ]);
                return null;
            }

            // Verify with gateway
            $result = $gateway->verify($reference);

            if (!$result['success']) {
                throw new \Exception($result['message']);
            }

            return DB::transaction(function () use ($payment, $result, $payload) {
                $oldStatus = $payment->status;
                
                if ($result['status'] === 'success' && $oldStatus !== 'success') {
                    $payment->markAsSuccess($result['transaction_id'], $result['provider_response']);
                    $this->activatePayable($payment);
                    $this->analytics->trackSuccess($payment);
                    
                } elseif ($result['status'] === 'failed' && $oldStatus !== 'failed') {
                    $payment->markAsFailed('Payment failed via webhook');
                    $this->analytics->trackFailure($payment, $result['message'] ?? null);
                }

                $payment->update([
                    'verification_response' => array_merge($result, ['webhook_payload' => $payload])
                ]);

                Log::info('Webhook processed successfully', [
                    'payment_id' => $payment->id,
                    'old_status' => $oldStatus,
                    'new_status' => $payment->status
                ]);

                return $payment;
            });

        } catch (\Exception $e) {
            Log::error('Webhook handling failed', [
                'provider' => $provider,
                'error' => $e->getMessage(),
                'payload' => $payload
            ]);

            throw $e;
        }
    }

    /**
     * Process subscription renewals
     */
    public function processRenewals()
    {
        $subscriptions = Subscription::needsRenewal()->get();

        foreach ($subscriptions as $subscription) {
            try {
                $this->renewSubscription($subscription);
            } catch (\Exception $e) {
                Log::error('Subscription renewal failed', [
                    'subscription_id' => $subscription->id,
                    'error' => $e->getMessage()
                ]);
                
                $subscription->recordFailedRenewal($e->getMessage());
            }
        }
    }

    /**
     * Renew a specific subscription
     */
    protected function renewSubscription(Subscription $subscription)
    {
        $gateway = $this->gatewayResolver->resolve($subscription->provider);

        $result = $gateway->chargeRecurring([
            'authorization_code' => $subscription->authorization_code,
            'email' => $subscription->user->email,
            'amount' => $subscription->price,
            'currency' => 'GHS'
        ]);

        if ($result['success'] && $result['status'] === 'success') {
            // Create payment record
            Payment::create([
                'reference' => Payment::generateReference(),
                'transaction_id' => $result['transaction_id'],
                'user_id' => $subscription->user_id,
                'payable_type' => Subscription::class,
                'payable_id' => $subscription->id,
                'provider' => $subscription->provider,
                'payment_method' => 'recurring',
                'phone_number' => $subscription->user->phone,
                'amount' => $subscription->price,
                'currency' => 'GHS',
                'status' => 'success',
                'paid_at' => now()
            ]);

            $subscription->recordSuccessfulRenewal();
            
            $this->analytics->trackRenewal($subscription);
            
            Log::info('Subscription renewed successfully', [
                'subscription_id' => $subscription->id
            ]);

        } else {
            throw new \Exception($result['message'] ?? 'Recurring charge failed');
        }
    }

    /**
     * Activate the payable item
     */
    protected function activatePayable(Payment $payment)
    {
        $payable = $payment->payable;

        if (!$payable) {
            Log::warning('Payable not found for payment', [
                'payment_id' => $payment->id
            ]);
            return;
        }

        switch ($payment->payable_type) {
            case 'App\\Models\\Subscription':
                $payable->activate();
                break;
                
            case 'App\\Models\\ListingBoost':
                $payable->activate();
                break;
                
            case 'App\\Models\\LeadCredit':
                $payable->addCredits();
                break;
        }
    }

    /**
     * Extract reference from webhook payload
     */
    protected function extractReference(string $provider, array $payload): ?string
    {
        return match($provider) {
            'paystack' => $payload['data']['reference'] ?? null,
            'flutterwave' => $payload['data']['tx_ref'] ?? $payload['data']['reference'] ?? null,
            default => null
        };
    }
}