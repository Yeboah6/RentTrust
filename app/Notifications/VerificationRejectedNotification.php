<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Rental;

class VerificationRejectedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected Rental $rental;
    protected ?string $rejectionReason;

    public function __construct(Rental $rental, ?string $rejectionReason = null)
    {
        $this->rental = $rental;
        $this->rejectionReason = $rejectionReason;
    }

    public function via($notifiable)
    {
        // Send via email and database notification
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $message = (new MailMessage)
            ->subject('⚠ Your listing verification was rejected')
            ->greeting("Hello {$notifiable->name},")
            ->line("Unfortunately, your listing **{$this->rental->title}** did not pass verification.");

        if ($this->rejectionReason) {
            $message->line("**Reason for rejection:**")
                ->line($this->rejectionReason);
        }

        $message->line('Please review the feedback above and resubmit your listing with the necessary updates.')
            ->line('If you have questions, please contact our support team.')
            ->line('Thank you for using our platform!');

        return $message;
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'verification_rejected',
            'rental_id' => $this->rental->id,
            'rental_title' => $this->rental->title,
            'message' => "Your listing \"{$this->rental->title}\" was rejected during verification.",
            'rejection_reason' => $this->rejectionReason,
            'icon' => 'alert-circle',
            'color' => 'error'
        ];
    }
}