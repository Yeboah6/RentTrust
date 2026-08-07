<?php

namespace App\Mail;

use App\Models\Rental;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ListingUpdatedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Rental $listing) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Listing Has Been Updated — ' . $listing->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.listing_updated',
        );
    }
}