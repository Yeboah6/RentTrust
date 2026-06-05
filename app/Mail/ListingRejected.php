<?php

namespace App\Mail;

use App\Models\Rental;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ListingRejected extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Rental $listing,
        public readonly string $rejectedBy,
        public readonly ?string $reason = null,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your Listing "' . $this->listing->title . '" Has Been Rejected');
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.listing-rejected',
            with: [
                'listing' => $this->listing,
                'rejectedBy' => $this->rejectedBy,
                'reason' => $this->reason,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
