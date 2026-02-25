<?php

namespace App\Gateways;

use App\Interfaces\PaymentGatewayInterface;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FlutterwaveGateway implements PaymentGatewayInterface
{
    private string $baseUrl  = 'https://api.flutterwave.com/v3';
    private string $secret;
    private string $publicKey;

    public function __construct()
    {
        $this->secret    = config('services.flutterwave.secret');
        $this->publicKey = config('services.flutterwave.public');
    }

    public function initialize(array $data): array
    {
        $response = $this->http()
            ->post("{$this->baseUrl}/payments", [
                'tx_ref'          => $data['reference'],
                'amount'          => $data['amount'],
                'currency'        => 'GHS',
                'redirect_url'    => route('payment.callback', ['provider' => 'flutterwave']),
                'payment_options' => 'mobilemoneyghana,card',
                'customer'        => [
                    'email' => $data['email'],
                    'name'  => $data['name'] ?? '',
                ],
                'customizations'  => [
                    'title'       => 'RentTrust',
                    'description' => "Subscribe to {$data['plan_name']} Plan",
                    'logo'        => config('app.url') . '/images/logo.png',
                ],
                'meta' => [
                    'user_id'   => $data['user_id'],
                    'plan_id'   => $data['plan_id'],
                    'plan_name' => $data['plan_name'],
                ],
            ]);

        if (! $response->successful()) {
            Log::error('Flutterwave initialize failed', [
                'status'   => $response->status(),
                'response' => $response->json(),
            ]);
            throw new \RuntimeException(
                'Flutterwave initialization failed: ' . ($response->json('message') ?? 'Unknown error')
            );
        }

        // Normalize to match Paystack structure
        $body = $response->json();
        return [
            'status' => $body['status'] === 'success',
            'data'   => [
                'authorization_url' => $body['data']['link'],
                'reference'         => $body['data']['tx_ref'] ?? '',
            ],
        ];
    }

    public function verify(string $reference): array
    {
        $response = $this->http()
            ->get("{$this->baseUrl}/transactions", ['tx_ref' => $reference]);

        if (! $response->successful()) {
            throw new \RuntimeException('Flutterwave verification failed');
        }

        $transaction = collect($response->json('data'))->first();

        if (! $transaction) {
            throw new \RuntimeException('Flutterwave transaction not found');
        }

        // Normalize to Paystack-like structure
        return [
            'status' => true,
            'data'   => [
                'status'    => $transaction['status'] === 'successful' ? 'success' : $transaction['status'],
                'reference' => $transaction['tx_ref'],
                'amount'    => $transaction['amount'],
                'metadata'  => $transaction['meta'] ?? [],
            ],
        ];
    }

    public function cancelSubscription(string $subscriptionCode): bool
    {
        $response = $this->http()
            ->put("{$this->baseUrl}/subscriptions/{$subscriptionCode}/cancel");

        return $response->successful();
    }

    /**
     * Returns an Http client pre-configured with auth token.
     * Disables SSL verification in local/dev to avoid cURL error 60.
     * SSL is always verified in production.
     */
    private function http(): PendingRequest
    {
        $client = Http::withToken($this->secret);

        if (! app()->isProduction()) {
            $client = $client->withoutVerifying();
        }

        return $client;
    }
}