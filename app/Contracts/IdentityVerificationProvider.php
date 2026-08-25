<?php

namespace App\Contracts;

interface IdentityVerificationProvider
{
    /**
     * Validate a Ghana Card number + PIN against the provider.
     *
     * @return array{ok: bool, subject_id: ?string, provider_reference: ?string, message: ?string}
     */
    public function validateCardPin(string $ghanaCardNumber, string $pin): array;

    /**
     * Submit a live selfie for biometric + liveness matching against the
     * subject previously identified by validateCardPin().
     *
     * @param  string  $imageContents  Raw JPEG bytes.
     * @return array{
     *   verified: bool,
     *   liveness_verified: ?bool,
     *   match_score: ?float,
     *   provider_reference: ?string,
     *   first_name: ?string,
     *   middle_name: ?string,
     *   last_name: ?string,
     *   date_of_birth: ?string,
     *   gender: ?string,
     *   failure_code: ?string,
     *   failure_reason: ?string,
     * }
     */
    public function verifyBiometric(string $imageContents, ?string $subjectId, ?string $nationalIdReference): array;

    public function name(): string;
}