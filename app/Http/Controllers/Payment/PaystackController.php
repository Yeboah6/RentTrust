<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Services\Payment\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaystackController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Handle Paystack webhook
     */
    public function webhook(Request $request)
    {
        // Verify webhook signature
        if (!$this->verifySignature($request)) {
            Log::warning('Invalid Paystack webhook signature');
            return response()->json(['status' => 'invalid signature'], 401);
        }

        $payload = $request->all();

        Log::info('Paystack webhook received', [
            'event' => $payload['event'] ?? 'unknown',
            'reference' => $payload['data']['reference'] ?? null
        ]);

        try {
            $this->paymentService->handleWebhook('paystack', $payload);
            
            return response()->json(['status' => 'success']);
            
        } catch (\Exception $e) {
            Log::error('Paystack webhook processing failed', [
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
        $reference = $request->get('reference');
        
        if (!$reference) {
            return redirect()->route('dashboard')
                ->with('error', 'No payment reference provided');
        }

        // Verify payment
        $result = $this->paymentService->verify($reference, 'paystack');

        if ($result['success'] && $result['payment']->status === 'success') {
            return redirect()->route('payment.success', ['reference' => $reference]);
        } else {
            return redirect()->route('payment.failed', ['reference' => $reference]);
        }
    }

    /**
     * Verify webhook signature
     */
    protected function verifySignature(Request $request): bool
    {
        $signature = $request->header('x-paystack-signature');
        
        if (!$signature) {
            return false;
        }

        $payload = $request->getContent();
        $computedSignature = hash_hmac('sha512', $payload, config('services.paystack.secret_key'));

        return hash_equals($computedSignature, $signature);
    }
}