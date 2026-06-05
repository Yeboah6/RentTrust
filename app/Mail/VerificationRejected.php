<?php

namespace App\Mail;

use App\Models\VerificationRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerificationRejected extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly VerificationRequest $verificationRequest,
        public readonly string $rejectedBy,
        public readonly ?string $rejectionReason = null,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your Listing Verification Has Been Rejected');
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.verification-rejected',
            with: [
                'verificationRequest' => $this->verificationRequest,
                'rejectedBy' => $this->rejectedBy,
                'rejectionReason' => $this->rejectionReason,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
