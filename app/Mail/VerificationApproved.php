<?php

namespace App\Mail;

use App\Models\VerificationRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerificationApproved extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly VerificationRequest $verificationRequest,
        public readonly string $approvedBy,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your Listing Verification Has Been Approved');
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.verification-approved',
            with: [
                'verificationRequest' => $this->verificationRequest,
                'approvedBy' => $this->approvedBy,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
