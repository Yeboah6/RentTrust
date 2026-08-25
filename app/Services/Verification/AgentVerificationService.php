<?php

namespace App\Services\Verification;

use App\Contracts\IdentityVerificationProvider;
use App\Jobs\ProcessAgentBiometricVerification;
use App\Models\AgentVerification;
use App\Models\IdentityVerification;
use App\Models\User;
use App\Models\VerificationConsent;
use App\Models\VerificationEvent;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AgentVerificationService
{
    public function __construct(private IdentityVerificationProvider $provider)
    {
    }

    public function getOrCreateAgentVerification(User $user): AgentVerification
    {
        return AgentVerification::firstOrCreate(
            ['user_id' => $user->id],
            ['status' => 'pending', 'identity_status' => 'not_started', 'professional_status' => 'not_started']
        );
    }

    /**
     * Step 1: Ghana Card number + PIN.
     *
     * @throws ValidationException if the provider rejects the PIN.
     */
    public function submitGhanaCard(User $user, string $ghanaCardNumber, string $pin): void
    {
        $agentVerification = $this->getOrCreateAgentVerification($user);

        if ($agentVerification->status === 'approved') {
            throw ValidationException::withMessages([
                'ghana_card_number' => 'You are already verified.',
            ]);
        }

        $result = $this->provider->validateCardPin($ghanaCardNumber, $pin);

        if (! $result['ok']) {
            VerificationEvent::log(
                agentVerificationId: $agentVerification->id,
                userId: $user->id,
                event: 'ghana_card_pin_failed',
                provider: $this->provider->name(),
                metadata: ['ghana_card_number' => $this->maskCardNumber($ghanaCardNumber)],
                source: 'nia',
            );

            throw ValidationException::withMessages([
                'ghana_card_pin' => $result['message'] ?? 'We could not validate that Ghana Card. Please check the number and PIN.',
            ]);
        }

        DB::transaction(function () use ($agentVerification, $ghanaCardNumber, $result, $user) {
            $identityVerification = IdentityVerification::updateOrCreate(
                ['agent_verification_id' => $agentVerification->id],
                [
                    'provider' => $this->provider->name(),
                    'provider_reference' => $result['provider_reference'],
                    'provider_subject_id' => $result['subject_id'],
                    'national_id_reference' => $ghanaCardNumber,
                    'status' => 'pending',
                    'started_at' => now(),
                    // Reset any prior attempt's outcome fields on resubmission.
                    'completed_at' => null,
                    'verified_at' => null,
                    'biometric_verified' => false,
                    'liveness_verified' => null,
                    'match_score' => null,
                    'failure_code' => null,
                    'failure_reason' => null,
                ]
            );

            $oldStatus = $agentVerification->identity_status;
            $agentVerification->update(['identity_status' => 'in_progress']);

            VerificationEvent::log(
                agentVerificationId: $agentVerification->id,
                userId: $user->id,
                event: 'ghana_card_submitted',
                oldStatus: $oldStatus,
                newStatus: 'in_progress',
                provider: $this->provider->name(),
                providerReference: $identityVerification->provider_reference,
                metadata: ['ghana_card_number' => $this->maskCardNumber($ghanaCardNumber)],
                source: 'nia',
            );
        });
    }

    /**
     * Step 2: consent checkboxes.
     *
     * @param  array<string,bool>  $consents  e.g. ['nia_data_share' => true, 'verification_terms' => true]
     *
     * @throws ValidationException if a required consent was not accepted.
     */
    public function recordConsent(User $user, array $consents): void
    {
        $agentVerification = $this->getOrCreateAgentVerification($user);

        $required = [VerificationConsent::TYPE_NIA_DATA_SHARE, VerificationConsent::TYPE_VERIFICATION_TERMS];
        $missing = array_filter($required, fn ($type) => empty($consents[$type]));

        if (! empty($missing)) {
            throw ValidationException::withMessages([
                'consents' => 'Please accept all consent items before continuing.',
            ]);
        }

        DB::transaction(function () use ($agentVerification, $consents, $user, $required) {
            foreach ($required as $type) {
                VerificationConsent::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'agent_verification_id' => $agentVerification->id,
                        'consent_type' => $type,
                    ],
                    [
                        'document_version' => VerificationConsent::CURRENT_DOCUMENT_VERSION,
                        'accepted' => true,
                        'accepted_at' => now(),
                        'ip_address' => request()?->ip(),
                        'user_agent' => request()?->userAgent(),
                        'withdrawn_at' => null,
                    ]
                );
            }

            VerificationEvent::log(
                agentVerificationId: $agentVerification->id,
                userId: $user->id,
                event: 'consent_recorded',
                metadata: ['consent_types' => $required],
                source: 'user',
            );
        });
    }

    /**
     * Step 3: live selfie. Dispatches a queued job so the request returns
     * immediately and the frontend can poll for the result — mirrors the
     * queued-notification pattern used elsewhere in this app.
     *
     * @throws ValidationException if step 1 hasn't been completed yet.
     */
    public function queueBiometricCapture(User $user, UploadedFile $selfie, string $livenessCheck): void
    {
        $agentVerification = $this->getOrCreateAgentVerification($user);
        $identityVerification = $agentVerification->latestIdentityVerification;

        if (! $identityVerification) {
            throw ValidationException::withMessages([
                'selfie' => 'Please complete the Ghana Card step before submitting a photo.',
            ]);
        }

        // Biometric images are not persisted long-term — write to a private
        // temp path, let the queued job consume it, then delete it.
        $tempPath = "verification-tmp/{$identityVerification->identity_verification_id}.jpg";
        Storage::disk('local')->put($tempPath, file_get_contents($selfie->getRealPath()));

        $identityVerification->update(['status' => 'processing']);

        VerificationEvent::log(
            agentVerificationId: $agentVerification->id,
            userId: $user->id,
            event: 'biometric_submitted',
            oldStatus: 'pending',
            newStatus: 'processing',
            provider: $identityVerification->provider,
            metadata: ['liveness_check' => $livenessCheck],
            source: 'user',
        );

        ProcessAgentBiometricVerification::dispatch($identityVerification->id, $tempPath, $livenessCheck);
    }

    /**
     * Step 4: status read for the polling endpoint.
     *
     * @return array{status: string, reason: ?string}
     */
    public function currentStatus(User $user): array
    {
        $agentVerification = $this->getOrCreateAgentVerification($user);
        $identityVerification = $agentVerification->latestIdentityVerification;

        if (! $identityVerification) {
            return ['status' => 'pending', 'reason' => null];
        }

        return match ($identityVerification->status) {
            'verified' => ['status' => 'verified', 'reason' => null],
            'failed' => ['status' => 'failed', 'reason' => $identityVerification->failure_reason],
            default => ['status' => 'pending', 'reason' => null],
        };
    }

    private function maskCardNumber(string $ghanaCardNumber): string
    {
        return Str::mask($ghanaCardNumber, '*', 4);
    }
}