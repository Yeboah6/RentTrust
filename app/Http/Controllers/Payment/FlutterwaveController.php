<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Services\Payment\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FlutterwaveController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Handle Flutterwave webhook
     */
    public function webhook(Request $request)
    {
        // Verify webhook signature
        if (!$this->verifySignature($request)) {
            Log::warning('Invalid Flutterwave webhook signature');
            return response()->json(['status' => 'invalid signature'], 401);
        }

        $payload = $request->all();

        Log::info('Flutterwave webhook received', [
            'event' => $payload['event'] ?? 'unknown',
            'reference' => $payload['data']['tx_ref'] ?? null
        ]);

        try {
            $this->paymentService->handleWebhook('flutterwave', $payload);
            
            return response()->json(['status' => 'success']);
            
        } catch (\Exception $e) {
            Log::error('Flutterwave webhook processing failed', [
                'error' => $e->getMessage(),
                'payload' => $payload
            ]);

            return response()->json(['status' => 'error'], 500);
        }
    }

    /**
     * Payment callback (redirect after payment)
     */
    public function callback(Request $request)
    {
        $status = $request->get('status');
        $txRef = $request->get('tx_ref');

        if (!$txRef) {
            return redirect()->route('dashboard')
                ->with('error', 'No payment reference provided');
        }

        if ($status === 'successful') {
            // Verify payment
            $result = $this->paymentService->verify($txRef, 'flutterwave');

            if ($result['success'] && $result['payment']->status === 'success') {
                return redirect()->route('payment.success', ['reference' => $txRef]);
            }
        }

        return redirect()->route('payment.failed', ['reference' => $txRef]);
    }

    /**
     * Verify webhook signature
     */
    protected function verifySignature(Request $request): bool
    {
        $signature = $request->header('verif-hash');
        
        if (!$signature) {
            return false;
        }

        // Flutterwave sends the secret hash in the header
        return $signature === config('services.flutterwave.secret_hash');
    }
}