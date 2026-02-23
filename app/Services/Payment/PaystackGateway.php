<?php

namespace App\Services\Payment;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaystackGateway implements PaymentGatewayInterface
{
    protected $baseUrl;
    protected $secretKey;
    protected $publicKey;

    public function __construct()
    {
        $this->baseUrl = config('services.paystack.base_url', 'https://api.paystack.co');
        $this->secretKey = config('services.paystack.secret_key');
        $this->publicKey = config('services.paystack.public_key');
    }

    /**
     * Initialize a mobile money payment
     */
    public function initialize(array $data): array
{
    try {
        $http = Http::withoutVerifying() // For local dev only
            ->withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ]);
        
        $response = $http->post($this->baseUrl . '/charge', [
            'email' => $data['email'],
            'amount' => $data['amount'] * 100,
            'currency' => 'GHS',
            'mobile_money' => [
                'phone' => $data['phone'],
                'provider' => $this->mapProvider($data['payment_method'] ?? $data['provider'])
            ],
            'metadata' => [
                'user_id' => $data['user_id'],
                'payable_type' => $data['payable_type'],
                'payable_id' => $data['payable_id'],
                'reference' => $data['reference'] ?? $this->generateReference()
            ]
        ]);

        $result = $response->json();
        
        // Log the full response for debugging
        Log::info('Paystack charge response:', $result);

        // Paystack returns status true AND message "Charge attempted" on success [citation:1][citation:7]
        if (isset($result['status']) && $result['status'] === true) {
            return [
                'success' => true,
                'reference' => $result['data']['reference'] ?? $data['reference'],
                'provider_reference' => $result['data']['reference'] ?? null,
                'message' => $result['message'] ?? 'Payment initialized successfully',
                'data' => $result['data'] ?? null
            ];
        }

        // Handle actual error
        return [
            'success' => false,
            'message' => $result['message'] ?? 'Unknown error occurred',
            'data' => $result
        ];

    } catch (\Exception $e) {
        Log::error('Paystack initialization failed', [
            'error' => $e->getMessage(),
            'data' => $data
        ]);

        return [
            'success' => false,
            'message' => $e->getMessage(),
            'data' => null
        ];
    }
}
    

    /**
     * Verify a payment
     */
    public function verify(string $reference): array
    {
        try {
            // ADD withoutVerifying() here too
            $response = Http::withoutVerifying() // ← ADD THIS
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $this->secretKey,
                ])->get($this->baseUrl . '/charge/' . $reference);

            $result = $response->json();

            if (!$result['status']) {
                throw new \Exception($result['message'] ?? 'Verification failed');
            }

            $data = $result['data'];

            return [
                'success' => true,
                'status' => $this->mapStatus($data['status']),
                'transaction_id' => $data['id'],
                'amount' => $data['amount'] / 100,
                'currency' => $data['currency'],
                'paid_at' => $data['paid_at'],
                'provider_response' => $data
            ];

        } catch (\Exception $e) {
            Log::error('Paystack verification failed', [
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
     * Charge recurring payment
     */
    public function chargeRecurring(array $data): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
            ])->post($this->baseUrl . '/transaction/charge_authorization', [
                'authorization_code' => $data['authorization_code'],
                'email' => $data['email'],
                'amount' => $data['amount'] * 100,
                'currency' => 'GHS'
            ]);

            $result = $response->json();

            if (!$result['status']) {
                throw new \Exception($result['message'] ?? 'Recurring charge failed');
            }

            return [
                'success' => true,
                'transaction_id' => $result['data']['id'],
                'status' => $this->mapStatus($result['data']['status']),
                'data' => $result['data']
            ];

        } catch (\Exception $e) {
            Log::error('Paystack recurring charge failed', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Validate phone number for provider
     */
    public function validatePhoneNumber(string $phone, string $provider): array
    {
        // Remove any non-numeric characters
        $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
        
        // Check if it starts with 0 or 233
        if (strlen($cleanPhone) === 9) {
            $cleanPhone = '233' . $cleanPhone;
        } elseif (strlen($cleanPhone) === 10 && substr($cleanPhone, 0, 1) === '0') {
            $cleanPhone = '233' . substr($cleanPhone, 1);
        } elseif (strlen($cleanPhone) === 12 && substr($cleanPhone, 0, 3) === '233') {
            // Already in correct format
        } else {
            return [
                'valid' => false,
                'message' => 'Invalid phone number format'
            ];
        }

        // Provider-specific validation
        $providerPrefixes = [
            'mtn' => ['23324', '23354', '23355', '23359'],
            'vodafone' => ['23320', '23350'],
            'airteltigo' => ['23327', '23357', '23326']
        ];

        $prefix = substr($cleanPhone, 0, 5);
        $isValidProvider = in_array($prefix, $providerPrefixes[$provider] ?? []);

        if (!$isValidProvider) {
            return [
                'valid' => false,
                'message' => "This number doesn't appear to be a valid {$provider} number"
            ];
        }

        return [
            'valid' => true,
            'phone' => $cleanPhone,
            'message' => 'Phone number is valid'
        ];
    }

    /**
     * Map provider to Paystack format
     */
    protected function mapProvider(string $provider): string
    {
        return match($provider) {
            'mtn' => 'mtn',
            'vodafone' => 'vodafone',
            'airteltigo' => 'tigo', // Paystack uses 'tigo' for AirtelTigo
            default => $provider
        };
    }

    /**
     * Map Paystack status to our status
     */
    protected function mapStatus(string $status): string
    {
        return match($status) {
            'success' => 'success',
            'pending' => 'pending',
            'failed' => 'failed',
            'abandoned' => 'failed',
            default => 'pending'
        };
    }
}