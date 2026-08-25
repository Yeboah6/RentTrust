<?php

namespace App\Services\Verification;

use App\Contracts\IdentityVerificationProvider;
use Illuminate\Support\Str;

/**
 * SandboxNiaProvider
 * -------------------
 * I don't have access to the real NIA (National Identification Authority)
 * API — its actual base URL, auth scheme, and request/response contract —
 * so this is a deliberately isolated stand-in that satisfies
 * IdentityVerificationProvider without inventing details about a real
 * government API I can't verify.
 *
 * It lets you build and test the whole flow (Ghana Card + PIN entry,
 * consent, biometric capture, polling, DB writes, events) end-to-end
 * locally. Swap it for a real provider by:
 *
 *   1. Creating e.g. app/Services/Verification/NiaApiProvider.php that
 *      implements IdentityVerificationProvider and talks to the real
 *      NIA integration endpoint your organisation has been given access to.
 *   2. Binding it in AppServiceProvider::register():
 *
 *        $this->app->bind(IdentityVerificationProvider::class, function () {
 *            return config('services.nia.sandbox', true)
 *                ? new SandboxNiaProvider()
 *                : new NiaApiProvider(config('services.nia'));
 *        });
 *
 *   3. Setting NIA_SANDBOX_MODE=false and the real NIA_* credentials in .env.
 *
 * Sandbox behaviour (deterministic, so it's testable):
 *   - PIN "0000" always fails validation (simulates a wrong PIN).
 *   - A Ghana Card number ending in "9" always fails biometric matching
 *     (simulates a no-match / fraud case) so you can exercise the failure UI.
 *   - Everything else "succeeds" after a short simulated processing delay.
 */
class SandboxNiaProvider implements IdentityVerificationProvider
{
    public function name(): string
    {
        return 'nia_sandbox';
    }

    public function validateCardPin(string $ghanaCardNumber, string $pin): array
    {
        if ($pin === '0000') {
            return [
                'ok' => false,
                'subject_id' => null,
                'provider_reference' => null,
                'message' => 'The PIN you entered does not match this Ghana Card.',
            ];
        }

        return [
            'ok' => true,
            'subject_id' => 'sandbox-' . Str::lower(Str::random(12)),
            'provider_reference' => (string) Str::uuid(),
            'message' => null,
        ];
    }

    public function verifyBiometric(string $imageContents, ?string $subjectId, ?string $nationalIdReference): array
    {
        $simulateFailure = str_ends_with((string) $subjectId, '9');

        if ($simulateFailure || $imageContents === '') {
            return [
                'verified' => false,
                'liveness_verified' => false,
                'match_score' => 12.40,
                'provider_reference' => (string) Str::uuid(),
                'first_name' => null,
                'middle_name' => null,
                'last_name' => null,
                'date_of_birth' => null,
                'gender' => null,
                'failure_code' => 'NO_MATCH',
                'failure_reason' => 'The submitted photo did not match the Ghana Card on file.',
            ];
        }

        return [
            'verified' => true,
            'liveness_verified' => true,
            'match_score' => 96.80,
            'provider_reference' => (string) Str::uuid(),
            'first_name' => null,
            'middle_name' => null,
            'last_name' => null,
            'date_of_birth' => null,
            'gender' => null,
            'failure_code' => null,
            'failure_reason' => null,
        ];
    }
}