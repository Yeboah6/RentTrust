<?php

namespace App\Interfaces;

interface PaymentGatewayInterface
{
    /**
     * Initialize a payment transaction.
     * Returns gateway-specific response containing redirect URL / authorization_url.
     */
    public function initialize(array $data): array;

    /**
     * Verify a transaction by reference.
     */
    public function verify(string $reference): array;

    /**
     * Cancel / disable a subscription on the provider side.
     */
    public function cancelSubscription(string $subscriptionCode): bool;
}