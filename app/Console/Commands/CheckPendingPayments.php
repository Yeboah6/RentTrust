<?php

namespace App\Console\Commands;

use App\Models\Payment;
use App\Services\Payment\PaymentService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckPendingPayments extends Command
{
    protected $signature = 'payments:check-pending';
    protected $description = 'Check status of pending payments';

    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        parent::__construct();
        $this->paymentService = $paymentService;
    }

    public function handle()
    {
        $this->info('Checking pending payments...');

        // Get pending payments that are not expired
        $payments = Payment::pending()
            ->where('created_at', '<=', now()->subMinutes(5)) // Older than 5 minutes
            ->get();

        $this->info("Found {$payments->count()} pending payments to check");

        foreach ($payments as $payment) {
            try {
                $this->info("Checking payment: {$payment->reference}");
                
                $result = $this->paymentService->verify($payment->reference);
                
                if ($result['success']) {
                    $this->info("Payment {$payment->reference} status: {$result['payment']->status}");
                } else {
                    $this->error("Failed to check payment {$payment->reference}: {$result['message']}");
                }
                
            } catch (\Exception $e) {
                Log::error('Error checking pending payment', [
                    'payment_id' => $payment->id,
                    'error' => $e->getMessage()
                ]);
                
                $this->error("Error checking payment {$payment->reference}: {$e->getMessage()}");
            }
        }

        // Handle expired payments
        $expired = Payment::expired()->get();
        
        foreach ($expired as $payment) {
            $payment->update(['status' => 'expired']);
            $this->info("Marked payment {$payment->reference} as expired");
        }

        $this->info('Done checking pending payments');
    }
}