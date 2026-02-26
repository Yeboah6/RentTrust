<?php

namespace App\Gateways;

use App\Interfaces\PaymentGatewayInterface;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaystackGateway implements PaymentGatewayInterface
{
    private string $baseUrl = 'https://api.paystack.co';
    private string $secret;

    public function __construct()
    {
        $this->secret = config('services.paystack.secret');
    }

    public function initialize(array $data): array
    {
        $response = $this->http()
            ->post("{$this->baseUrl}/transaction/initialize", [
                'email'        => $data['email'],
                'amount'       => (int) ($data['amount'] * 100), // pesewas
                'currency'     => 'GHS',
                'reference'    => $data['reference'],
                'callback_url' => route('payment.callback', ['provider' => 'paystack']),
                'channels'     => ['mobile_money', 'card'],
                'metadata'     => [
                    'user_id'  => $data['user_id'],
                    'plan_id'  => $data['plan_id'],
                    'plan_name' => $data['plan_name'],
                    'custom_fields' => [[
                        'display_name'  => 'Plan',
                        'variable_name' => 'plan',
                        'value'         => $data['plan_name'],
                    ]],
                ],
            ]);

        if (! $response->successful()) {
            Log::error('Paystack initialize failed', [
                'status'   => $response->status(),
                'response' => $response->json(),
            ]);
            throw new \RuntimeException(
                'Paystack initialization failed: ' . ($response->json('message') ?? 'Unknown error')
            );
        }

        return $response->json();
    }

    public function verify(string $reference): array
    {
        $response = $this->http()
            ->get("{$this->baseUrl}/transaction/verify/{$reference}");

        if (! $response->successful()) {
            Log::error('Paystack verify failed', [
                'reference' => $reference,
                'response'  => $response->json(),
            ]);
            throw new \RuntimeException('Paystack verification failed');
        }

        return $response->json();
    }

    public function cancelSubscription(string $subscriptionCode): bool
    {
        $token = $this->getSubscriptionToken($subscriptionCode);

        $response = $this->http()
            ->post("{$this->baseUrl}/subscription/disable", [
                'code'  => $subscriptionCode,
                'token' => $token,
            ]);

        return $response->successful() && $response->json('status') === true;
    }

    private function getSubscriptionToken(string $code): string
    {
        $response = $this->http()
            ->get("{$this->baseUrl}/subscription/{$code}");

        return $response->json('data.email_token') ?? '';
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