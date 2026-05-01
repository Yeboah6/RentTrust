<?php

return [
    'default_provider' => env('DEFAULT_PAYMENT_PROVIDER', 'paystack'),
    'fallback_provider' => env('FALLBACK_PAYMENT_PROVIDER', 'flutterwave'),
    
    'timeout_minutes' => env('PAYMENT_TIMEOUT_MINUTES', 30),
    
    'currencies' => ['GHS'],
    
    'providers' => [
        'paystack' => [
            'name' => 'Paystack',
            'class' => App\Gateways\PaystackGateway::class,
            'enabled' => true,
        ],
        'flutterwave' => [
            'name' => 'Flutterwave',
            'class' => App\Gateways\FlutterwaveGateway::class,
            'enabled' => true,
        ],
    ],
    
    'payment_methods' => [
        'mtn' => ['name' => 'MTN Mobile Money', 'enabled' => true],
        'vodafone' => ['name' => 'Vodafone Cash', 'enabled' => true],
        'airteltigo' => ['name' => 'AirtelTigo Money', 'enabled' => true],
    ],
];