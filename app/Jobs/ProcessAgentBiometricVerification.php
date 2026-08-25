<?php

namespace App\Jobs;

use App\Contracts\IdentityVerificationProvider;
use App\Models\IdentityVerification;
use App\Models\VerificationEvent;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProcessAgentBiometricVerification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;
    public int $timeout = 60;

    public function __construct(
        private readonly int $identityVerificationId,
        private readonly string $tempImagePath,
        private readonly string $livenessCheck,
    ) {
    }

    public function handle(IdentityVerificationProvider $provider): void
    {
        $identityVerification = IdentityVerification::with('agentVerification')->find($this->identityVerificationId);

        if (! $identityVerification) {
            $this->cleanupTempFile();
            return;
        }

        $agentVerification = $identityVerification->agentVerification;
        $imageContents = Storage::disk('local')->exists($this->tempImagePath)
            ? Storage::disk('local')->get($this->tempImagePath)
            : '';

        $result = $provider->verifyBiometric(
            $imageContents,
            $identityVerification->provider_subject_id,
            $identityVerification->national_id_reference,
        );

        DB::transaction(function () use ($identityVerification, $agentVerification, $result) {
            $newIdentityStatus = $result['verified'] ? 'verified' : 'failed';

            $identityVerification->update([
                'status' => $newIdentityStatus,
                'biometric_verified' => $result['verified'],
                'biometric_method' => 'selfie_liveness',
                'liveness_verified' => $result['liveness_verified'],
                'match_score' => $result['match_score'],
                'verified_first_name' => $result['first_name'],
                'verified_middle_name' => $result['middle_name'],
                'verified_last_name' => $result['last_name'],
                'verified_date_of_birth' => $result['date_of_birth'],
                'verified_gender' => $result['gender'],
                'failure_code' => $result['failure_code'],
                'failure_reason' => $result['failure_reason'],
                'completed_at' => now(),
                'verified_at' => $result['verified'] ? now() : null,
                // Ghana Card verifications are treated as valid for 12 months.
                'expires_at' => $result['verified'] ? now()->addYear() : null,
            ]);

            $oldAgentStatus = $agentVerification->identity_status;

            $agentVerification->update([
                'identity_status' => $newIdentityStatus,
                'identity_verified_at' => $result['verified'] ? now() : null,
                // Professional (license) verification isn't wired up yet, so
                // overall approval currently tracks identity verification only.
                'status' => $result['verified'] ? 'approved' : 'rejected',
                'verified_at' => $result['verified'] ? now() : null,
                'expires_at' => $result['verified'] ? now()->addYear() : null,
                'rejection_reason' => $result['verified'] ? null : $result['failure_reason'],
            ]);

            $agentVerification->user()->update([
                'verification_status' => $result['verified'] ? 'verified' : 'unverified',
                'identity_verified_at' => $result['verified'] ? now() : null,
                'agent_verified_at' => $result['verified'] ? now() : null,
                'verification_expires_at' => $result['verified'] ? now()->addYear() : null,
            ]);

            VerificationEvent::log(
                agentVerificationId: $agentVerification->id,
                userId: $agentVerification->user_id,
                event: $result['verified'] ? 'nia_verification_succeeded' : 'nia_verification_failed',
                oldStatus: $oldAgentStatus,
                newStatus: $newIdentityStatus,
                provider: $identityVerification->provider,
                providerReference: $result['provider_reference'],
                metadata: [
                    'match_score' => $result['match_score'],
                    'liveness_verified' => $result['liveness_verified'],
                    'failure_code' => $result['failure_code'],
                ],
                source: 'nia',
            );
        });

        $this->cleanupTempFile();
    }

    public function failed(\Throwable $exception): void
    {
        $identityVerification = IdentityVerification::find($this->identityVerificationId);

        if ($identityVerification) {
            $identityVerification->update([
                'status' => 'failed',
                'failure_code' => 'PROVIDER_ERROR',
                'failure_reason' => 'We could not complete verification right now. Please try again shortly.',
                'completed_at' => now(),
            ]);

            if ($identityVerification->agentVerification) {
                VerificationEvent::log(
                    agentVerificationId: $identityVerification->agentVerification->id,
                    userId: $identityVerification->agentVerification->user_id,
                    event: 'nia_verification_errored',
                    metadata: ['error' => $exception->getMessage()],
                    source: 'system',
                );
            }
        }

        $this->cleanupTempFile();
    }

    private function cleanupTempFile(): void
    {
        Storage::disk('local')->delete($this->tempImagePath);
    }
}