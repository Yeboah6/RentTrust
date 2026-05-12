<?php

namespace App\Notifications;

use App\Models\Rental;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

/**
 * Notification sent when a listing verification is approved
 */
class VerificationApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected Rental $rental;

    public function __construct(Rental $rental)
    {
        $this->rental = $rental;
    }

    public function via($notifiable)
    {
        // Send via email and database notification
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('✓ Your listing has been verified!')
            ->greeting("Great news, {$notifiable->name}!")
            ->line("Your listing **{$this->rental->title}** has been approved and verified.")
            ->line('Your property is now live and visible to potential renters.')
            ->action('View Your Listing', route('listing.show', $this->rental->id))
            ->line('Thank you for using our platform!');
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'verification_approved',
            'rental_id' => $this->rental->id,
            'rental_title' => $this->rental->title,
            'message' => "Your listing \"{$this->rental->title}\" has been verified and is now live.",
            'action_url' => route('listing.show', $this->rental->id),
            'icon' => 'check-circle',
            'color' => 'success'
        ];
    }
}

/**
 * Notification sent when a listing verification is rejected
 */
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
            ->action('Update Your Listing', route('listing.edit', $this->rental->id))
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
            'action_url' => route('listing.edit', $this->rental->id),
            'icon' => 'alert-circle',
            'color' => 'error'
        ];
    }
}