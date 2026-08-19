<?php

namespace App\Mail;

use App\Models\Rental;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewListingMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Rental $rental, public readonly string $body)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "New listing: {$this->rental->title}"
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.new-listing',
            with: [
                'rentalTitle' => $this->rental->title,
                'body' => $this->body,
            ]
        );
    }
}
