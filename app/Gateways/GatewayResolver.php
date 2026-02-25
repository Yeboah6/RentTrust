<?php

namespace App\Gateways;

use App\Interfaces\PaymentGatewayInterface;

class GatewayResolver
{
    public static function resolve(string $provider): PaymentGatewayInterface
    {
        return match ($provider) {
            'paystack'     => new PaystackGateway(),
            'flutterwave'  => new FlutterwaveGateway(),
            default        => throw new \InvalidArgumentException("Unsupported payment provider: {$provider}"),
        };
    }

    public static function fallback(string $primary): string
    {
        return $primary === 'paystack' ? 'flutterwave' : 'paystack';
    }
}