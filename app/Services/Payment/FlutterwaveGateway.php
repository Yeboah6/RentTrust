<?php

namespace App\Services\Payment;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FlutterwaveGateway implements PaymentGatewayInterface
{
    protected $baseUrl;
    protected $secretKey;
    protected $publicKey;

    public function __construct()
    {
        $this->baseUrl = config('services.flutterwave.base_url', 'https://api.flutterwave.com/v3');
        $this->secretKey = config('services.flutterwave.secret_key');
        $this->publicKey = config('services.flutterwave.public_key');
    }

    /**
     * Initialize a mobile money payment
     */
    public function initialize(array $data): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/charges?type=mobile_money_ghana', [
                'tx_ref' => $data['reference'],
                'amount' => $data['amount'],
                'currency' => 'GHS',
                'email' => $data['email'],
                'phone_number' => $data['phone'],
                'fullname' => $data['fullname'] ?? $data['email'],
                'order_id' => $data['reference'],
                'meta' => [
                    'user_id' => $data['user_id'],
                    'payable_type' => $data['payable_type'],
                    'payable_id' => $data['payable_id']
                ],
                'network' => $this->mapProvider($data['provider']),
                'redirect_url' => route('payment.callback'),
                'client_ip' => request()->ip(),
                'device_fingerprint' => request()->userAgent()
            ]);

            $result = $response->json();

            if ($result['status'] !== 'success') {
                throw new \Exception($result['message'] ?? 'Flutterwave initialization failed');
            }

            return [
                'success' => true,
                'reference' => $data['reference'],
                'provider_reference' => $result['data']['id'] ?? null,
                'message' => 'Payment initialized successfully',
                'data' => $result['data']
            ];

        } catch (\Exception $e) {
            Log::error('Flutterwave initialization failed', [
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
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
            ])->get($this->baseUrl . '/transactions/' . $reference . '/verify');

            $result = $response->json();

            if ($result['status'] !== 'success') {
                throw new \Exception($result['message'] ?? 'Verification failed');
            }

            $data = $result['data'];

            return [
                'success' => true,
                'status' => $this->mapStatus($data['status']),
                'transaction_id' => $data['id'],
                'amount' => $data['amount'],
                'currency' => $data['currency'],
                'paid_at' => $data['created_at'],
                'provider_response' => $data
            ];

        } catch (\Exception $e) {
            Log::error('Flutterwave verification failed', [
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
            ])->post($this->baseUrl . '/tokenized-charges', [
                'token' => $data['authorization_code'],
                'email' => $data['email'],
                'amount' => $data['amount'],
                'currency' => 'GHS',
                'tx_ref' => 'RENT-RENEWAL-' . uniqid()
            ]);

            $result = $response->json();

            if ($result['status'] !== 'success') {
                throw new \Exception($result['message'] ?? 'Recurring charge failed');
            }

            return [
                'success' => true,
                'transaction_id' => $result['data']['id'],
                'status' => $this->mapStatus($result['data']['status']),
                'data' => $result['data']
            ];

        } catch (\Exception $e) {
            Log::error('Flutterwave recurring charge failed', [
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
        // Similar validation as Paystack but with Flutterwave-specific rules
        $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
        
        if (strlen($cleanPhone) === 9) {
            $cleanPhone = '233' . $cleanPhone;
        } elseif (strlen($cleanPhone) === 10 && substr($cleanPhone, 0, 1) === '0') {
            $cleanPhone = '233' . substr($cleanPhone, 1);
        }

        // Flutterwave expects exactly 12 digits for Ghana
        if (strlen($cleanPhone) !== 12) {
            return [
                'valid' => false,
                'message' => 'Phone number must be 10 digits (including 0)'
            ];
        }

        // Validate provider
        $validProviders = [
            'mtn' => ['024', '054', '055', '059'],
            'vodafone' => ['020', '050'],
            'airteltigo' => ['027', '057', '026']
        ];

        $prefix = substr($cleanPhone, 3, 3); // Get 3 digits after 233
        $isValid = false;

        foreach ($validProviders[$provider] ?? [] as $validPrefix) {
            if ($prefix === substr($validPrefix, 1)) { // Compare without leading 0
                $isValid = true;
                break;
            }
        }

        if (!$isValid) {
            return [
                'valid' => false,
                'message' => "This number is not registered with {$provider}"
            ];
        }

        return [
            'valid' => true,
            'phone' => $cleanPhone,
            'message' => 'Phone number is valid'
        ];
    }

    /**
     * Map provider to Flutterwave format
     */
    protected function mapProvider(string $provider): string
    {
        return match($provider) {
            'mtn' => 'MTN',
            'vodafone' => 'VODAFONE',
            'airteltigo' => 'AIRTELTIGO',
            default => strtoupper($provider)
        };
    }

    /**
     * Map Flutterwave status to our status
     */
    protected function mapStatus(string $status): string
    {
        return match($status) {
            'successful' => 'success',
            'pending' => 'pending',
            'failed' => 'failed',
            default => 'pending'
        };
    }
}