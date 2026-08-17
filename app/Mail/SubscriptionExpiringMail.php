<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Subscription;

class SubscriptionExpiringMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $subscription;
    public $daysLeft;

    public function __construct(Subscription $subscription, int $daysLeft)
    {
        $this->subscription = $subscription;
        $this->daysLeft = $daysLeft;
    }

    public function build()
    {
        $template = $this->getEmailTemplate();
        
        return $this->subject("Subscription Expiring Soon - {$this->daysLeft} Days Left")
                    ->view($template)
                    ->with([
                        'userName' => $this->subscription->user->name,
                        'planName' => $this->subscription->plan->name,
                        'endDate' => $this->subscription->ends_at->format('F j, Y'),
                        'daysLeft' => $this->daysLeft,
                        'renewUrl' => route('subscription.renew'),
                    ]);
    }

    protected function getEmailTemplate()
    {
        return match($this->daysLeft) {
            15 => 'emails.subscription.expiring-15-days',
            7 => 'emails.subscription.expiring-7-days',
            1 => 'emails.subscription.expiring-1-day',
            default => 'emails.subscription.expiring'
        };
    }
}