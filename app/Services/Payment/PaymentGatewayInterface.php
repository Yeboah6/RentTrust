<?php

namespace App\Services\Payment;

interface PaymentGatewayInterface
{
    /**
     * Initialize a payment
     */
    public function initialize(array $data): array;

    /**
     * Verify a payment
     */
    public function verify(string $reference): array;

    /**
     * Charge a recurring payment
     */
    public function chargeRecurring(array $data): array;

    /**
     * Validate phone number for provider
     */
    public function validatePhoneNumber(string $phone, string $provider): array;
}