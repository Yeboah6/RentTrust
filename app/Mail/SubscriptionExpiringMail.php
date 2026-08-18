<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Subscription;

class SubscriptionExpiringMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Subscription $subscription,
        public readonly int $daysLeft
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Subscription Expiring Soon - {$this->daysLeft} Days Left"
        );
    }

    public function content(): Content
    {
        $template = match($this->daysLeft) {
            15 => 'emails.subscription.expiring-15-days',
            7 => 'emails.subscription.expiring-7-days',
            1 => 'emails.subscription.expiring-1-day',
            default => 'emails.subscription.expiring'
        };

        return new Content(
            view: $template,
            with: [
                'userName' => $this->subscription->user?->name ?? 'Subscriber',
                'planName' => $this->subscription->plan?->name ?? 'Plan',
                'endDate' => $this->subscription->ends_at?->format('F j, Y'),
                'daysLeft' => $this->daysLeft,
                'renewUrl' => route('subscription.renew'),
            ]
        );
    }
}