<?php

namespace App\Services\Payment;

use InvalidArgumentException;

class GatewayResolver
{
    protected $gateways = [];

    public function __construct()
    {
        $this->gateways = [
            'paystack' => PaystackGateway::class,
            'flutterwave' => FlutterwaveGateway::class,
        ];
    }

    /**
     * Resolve the payment gateway
     */
    public function resolve(string $provider): PaymentGatewayInterface
    {
        $provider = strtolower($provider);

        if (!isset($this->gateways[$provider])) {
            throw new InvalidArgumentException("Payment provider [{$provider}] is not supported.");
        }

        $gatewayClass = $this->gateways[$provider];

        return app($gatewayClass);
    }

    /**
     * Get available providers
     */
    public function getAvailableProviders(): array
    {
        return array_keys($this->gateways);
    }

    /**
     * Get primary provider
     */
    public function getPrimaryProvider(): string
    {
        return config('payment.default_provider', 'paystack');
    }

    /**
     * Get fallback provider
     */
    public function getFallbackProvider(): string
    {
        return config('payment.fallback_provider', 'flutterwave');
    }

    /**
     * Check if provider is available
     */
    public function isAvailable(string $provider): bool
    {
        return isset($this->gateways[strtolower($provider)]);
    }
}