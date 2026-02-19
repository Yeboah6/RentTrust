<?php

namespace App\Services\Analytics;

use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class PaymentAnalytics
{
    /**
     * Track payment initialization
     */
    public function trackInitialization(Payment $payment, string $provider)
    {
        $this->incrementMetric("payments.initialized.{$provider}");
        $this->incrementMetric("payments.initialized.{$payment->payment_method}");
        
        Log::channel('analytics')->info('Payment initialized', [
            'provider' => $provider,
            'method' => $payment->payment_method,
            'amount' => $payment->amount,
            'user_id' => $payment->user_id
        ]);
    }

    /**
     * Track successful payment
     */
    public function trackSuccess(Payment $payment)
    {
        $this->incrementMetric("payments.success.{$payment->provider}");
        $this->incrementMetric("payments.success.{$payment->payment_method}");
        $this->incrementMetric("payments.success.{$payment->payable_type}");
        
        // Track revenue
        $this->addRevenue($payment);
        
        Log::channel('analytics')->info('Payment successful', [
            'payment_id' => $payment->id,
            'provider' => $payment->provider,
            'method' => $payment->payment_method,
            'amount' => $payment->amount,
            'user_id' => $payment->user_id
        ]);
    }

    /**
     * Track failed payment
     */
    public function trackFailure(Payment $payment, ?string $error = null)
    {
        $this->incrementMetric("payments.failed.{$payment->provider}");
        $this->incrementMetric("payments.failed.{$payment->payment_method}");
        
        Log::channel('analytics')->warning('Payment failed', [
            'payment_id' => $payment->id,
            'provider' => $payment->provider,
            'method' => $payment->payment_method,
            'error' => $error,
            'user_id' => $payment->user_id
        ]);
    }

    /**
     * Track subscription renewal
     */
    public function trackRenewal(Subscription $subscription)
    {
        $this->incrementMetric("subscriptions.renewed.{$subscription->provider}");
        $this->incrementMetric("subscriptions.renewed.{$subscription->plan_type}");
        
        Log::channel('analytics')->info('Subscription renewed', [
            'subscription_id' => $subscription->id,
            'provider' => $subscription->provider,
            'plan' => $subscription->plan_type,
            'amount' => $subscription->price,
            'user_id' => $subscription->user_id
        ]);
    }

    /**
     * Get payment metrics
     */
    public function getMetrics(string $period = 'today')
    {
        $cacheKey = "payment_metrics_{$period}";
        
        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($period) {
            $query = Payment::query();
            
            switch ($period) {
                case 'today':
                    $query->whereDate('created_at', today());
                    break;
                case 'week':
                    $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
                    break;
                case 'month':
                    $query->whereMonth('created_at', now()->month);
                    break;
            }
            
            $successful = (clone $query)->where('status', 'success');
            
            return [
                'total_payments' => $query->count(),
                'successful_payments' => $successful->count(),
                'failed_payments' => (clone $query)->where('status', 'failed')->count(),
                'pending_payments' => (clone $query)->where('status', 'pending')->count(),
                'total_revenue' => $successful->sum('amount'),
                'by_provider' => $this->getBreakdown(clone $query, 'provider'),
                'by_method' => $this->getBreakdown(clone $query, 'payment_method'),
                'average_amount' => $successful->avg('amount')
            ];
        });
    }

    /**
     * Increment a metric counter
     */
    protected function incrementMetric(string $key, int $increment = 1)
    {
        $date = now()->format('Y-m-d');
        $cacheKey = "metric:{$key}:{$date}";
        
        Cache::increment($cacheKey, $increment);
        
        // Also store in database for persistence
        // You could log to a metrics table here
    }

    /**
     * Add to revenue counter
     */
    protected function addRevenue(Payment $payment)
    {
        $date = now()->format('Y-m-d');
        $cacheKey = "revenue:total:{$date}";
        
        Cache::increment($cacheKey, $payment->amount * 100); // Store in smallest unit
        
        // Track by provider
        $providerKey = "revenue:{$payment->provider}:{$date}";
        Cache::increment($providerKey, $payment->amount * 100);
    }

    /**
     * Get breakdown by column
     */
    protected function getBreakdown($query, string $column)
    {
        return $query->where('status', 'success')
                     ->groupBy($column)
                     ->selectRaw("{$column}, count(*) as count, sum(amount) as total")
                     ->pluck('total', $column)
                     ->toArray();
    }
}