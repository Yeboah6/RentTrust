<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Rental;

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