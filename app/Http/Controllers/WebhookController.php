<?php

namespace App\Http\Controllers;

use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function __construct(private PaymentService $paymentService) {}

    // ─── Paystack Webhook ────────────────────────────────────────────────────

    public function paystack(Request $request)
    {
        // 1. Verify signature
        $signature = $request->header('x-paystack-signature');
        $computed  = hash_hmac('sha512', $request->getContent(), config('services.paystack.secret'));

        if (! hash_equals($computed, (string) $signature)) {
            Log::warning('Paystack webhook: invalid signature');
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        $payload = $request->all();
        $event   = $payload['event'] ?? '';

        Log::info("Paystack webhook received: {$event}", ['reference' => $payload['data']['reference'] ?? null]);

        match ($event) {
            'charge.success' => $this->handlePaystackCharge($payload),
            'subscription.disable', 'subscription.not_renew' => $this->handlePaystackCancellation($payload),
            default => null,
        };

        return response()->json(['status' => 'ok']);
    }

    private function handlePaystackCharge(array $payload): void
    {
        $reference = $payload['data']['reference'] ?? null;

        if (! $reference) {
            Log::error('Paystack: missing reference in webhook payload');
            return;
        }

        $this->paymentService->confirm($reference, $payload, 'paystack');
    }

    private function handlePaystackCancellation(array $payload): void
    {
        $subscriptionCode = $payload['data']['subscription_code'] ?? null;

        if (! $subscriptionCode) {
            return;
        }

        \App\Models\Subscription::where('provider_subscription_id', $subscriptionCode)
            ->update(['status' => 'cancelled']);

        Log::info('Paystack subscription cancelled', ['code' => $subscriptionCode]);
    }

    // ─── Flutterwave Webhook ─────────────────────────────────────────────────

    public function flutterwave(Request $request)
    {
        // 1. Verify secret hash
        $hash = $request->header('verif-hash');

        if ($hash !== config('services.flutterwave.hash')) {
            Log::warning('Flutterwave webhook: invalid hash');
            return response()->json(['error' => 'Invalid hash'], 403);
        }

        $payload = $request->all();
        $event   = $payload['event'] ?? '';

        Log::info("Flutterwave webhook received: {$event}", ['ref' => $payload['data']['tx_ref'] ?? null]);

        match ($event) {
            'charge.completed' => $this->handleFlutterwaveCharge($payload),
            'subscription.cancelled' => $this->handleFlutterwaveCancellation($payload),
            default => null,
        };

        return response()->json(['status' => 'ok']);
    }

    private function handleFlutterwaveCharge(array $payload): void
    {
        $data      = $payload['data'] ?? [];
        $reference = $data['tx_ref'] ?? null;
        $status    = $data['status'] ?? '';

        if (! $reference || $status !== 'successful') {
            Log::warning('Flutterwave: invalid charge payload', ['status' => $status]);
            return;
        }

        // Normalize payload structure to match our confirm() expectations
        $normalizedPayload = [
            'data' => [
                'reference' => $reference,
                'status'    => 'success',
                'amount'    => $data['amount'] ?? 0,
                'metadata'  => $data['meta'] ?? [],
            ],
        ];

        $this->paymentService->confirm($reference, $normalizedPayload, 'flutterwave');
    }

    private function handleFlutterwaveCancellation(array $payload): void
    {
        $subscriptionId = $payload['data']['id'] ?? null;

        if (! $subscriptionId) {
            return;
        }

        \App\Models\Subscription::where('provider_subscription_id', $subscriptionId)
            ->update(['status' => 'cancelled']);
    }
}