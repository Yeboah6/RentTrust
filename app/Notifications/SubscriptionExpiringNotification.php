<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Subscription;
use Illuminate\Support\Facades\Log;

class SubscriptionExpiringNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The subscription instance.
     *
     * @var Subscription
     */
    protected $subscription;

    /**
     * Number of days left until subscription expires.
     *
     * @var int
     */
    protected $daysLeft;

    /**
     * Create a new notification instance.
     */
    public function __construct(Subscription $subscription, int $daysLeft)
    {
        $this->subscription = $subscription;
        $this->daysLeft = $daysLeft;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        try {
            $planName = $this->subscription->plan->name ?? 'Premium';
            $endDate = $this->subscription->ends_at ? $this->subscription->ends_at->format('F j, Y') : 'soon';
            
            $message = (new MailMessage)
                ->subject("Your {$planName} subscription expires in {$this->daysLeft} " . ($this->daysLeft === 1 ? 'day' : 'days'))
                ->greeting("Hello {$notifiable->name}!")
                ->line("Your {$planName} subscription is set to expire on {$endDate}.")
                ->line("You have {$this->daysLeft} " . ($this->daysLeft === 1 ? 'day' : 'days') . " remaining on your current subscription.");

            // Add urgency for 1-day notification
            if ($this->daysLeft === 1) {
                $message->line('⚠️ This is your final reminder! Renew today to avoid service interruption.');
            }

            // Use direct URL to avoid route dependency
            $renewUrl = url('/pricing');
            $message->action('Renew Subscription', $renewUrl)
                   ->line('Thank you for using our service!');

            return $message;
        } catch (\Exception $e) {
            Log::error('Error building subscription expiry email', [
                'subscription_id' => $this->subscription->id ?? null,
                'days_left' => $this->daysLeft,
                'error' => $e->getMessage(),
            ]);
            
            // Return a fallback message
            return (new MailMessage)
                ->subject('Subscription Expiring Soon')
                ->line('Your subscription is expiring soon.')
                ->line('Please log in to renew your subscription.');
        }
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        return [
            'subscription_id' => $this->subscription->id,
            'plan_name' => $this->subscription->plan->name ?? 'Premium',
            'days_left' => $this->daysLeft,
            'ends_at' => $this->subscription->ends_at,
            'message' => "Your {$this->subscription->plan->name} subscription expires in {$this->daysLeft} days",
        ];
    }
}