<?php

namespace App\Mail;

use App\Models\Rental;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ListingApproved extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Rental $listing,
        public readonly string $approvedBy,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your Listing "' . $this->listing->title . '" Has Been Approved');
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.listing-approved',
            with: [
                'listing' => $this->listing,
                'approvedBy' => $this->approvedBy,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
