<?php

namespace App\Http\Controllers;

use App\Http\Requests\Verification\SubmitBiometricRequest;
use App\Http\Requests\Verification\SubmitConsentRequest;
use App\Http\Requests\Verification\SubmitGhanaCardRequest;
use App\Services\Verification\AgentVerificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class AgentVerificationController extends Controller
{
    public function __construct(private AgentVerificationService $verificationService)
    {
    }

    /**
     * Step 1 — POST /agent-verification/ghana-card
     */
    public function submitGhanaCard(SubmitGhanaCardRequest $request): RedirectResponse
    {
        $this->verificationService->submitGhanaCard(
            $request->user(),
            $request->validated('ghana_card_number'),
            $request->validated('ghana_card_pin'),
        );

        return back();
    }

    /**
     * Step 2 — POST /agent-verification/consent
     */
    public function submitConsent(SubmitConsentRequest $request): RedirectResponse
    {
        $this->verificationService->recordConsent(
            $request->user(),
            $request->validated('consents'),
        );

        return back();
    }

    /**
     * Step 3 — POST /agent-verification/biometric-capture
     */
    public function submitBiometric(SubmitBiometricRequest $request): RedirectResponse
    {
        $this->verificationService->queueBiometricCapture(
            $request->user(),
            $request->file('selfie'),
            $request->validated('liveness_check') ?? 'blink',
        );

        return back();
    }

    /**
     * Step 4 — GET /agent-verification/nia-status
     *
     * Plain JSON (not an Inertia response) since the frontend polls this
     * with a raw fetch(), not router.get().
     */
    public function niaStatus(): JsonResponse
    {
        return response()->json(
            $this->verificationService->currentStatus(request()->user())
        );
    }
}