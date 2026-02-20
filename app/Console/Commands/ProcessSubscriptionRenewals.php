<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use App\Services\Payment\PaymentService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ProcessSubscriptionRenewals extends Command
{
    protected $signature = 'subscriptions:process-renewals';
    protected $description = 'Process subscription renewals';

    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        parent::__construct();
        $this->paymentService = $paymentService;
    }

    public function handle()
    {
        $this->info('Processing subscription renewals...');

        try {
            $this->paymentService->processRenewals();
            
            $this->info('Subscription renewals processed successfully');
            
        } catch (\Exception $e) {
            Log::error('Failed to process subscription renewals', [
                'error' => $e->getMessage()
            ]);
            
            $this->error('Failed to process renewals: ' . $e->getMessage());
        }
    }
}