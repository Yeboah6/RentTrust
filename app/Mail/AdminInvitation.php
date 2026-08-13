<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminInvitation extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public readonly string $adminName,
        public readonly string $adminEmail,
        public readonly ?string $setupUrl = null,
        public readonly ?string $expiresAt = null,
        public readonly ?string $temporaryPassword = null,
        public readonly ?string $loginUrl = null,
        public readonly bool $isPasswordReset = false,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->isPasswordReset
            ? 'Your RentTrustGH administrator password was reset'
            : "You've been invited to RentTrustGH as an Administrator";

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.AdminInvitation',
            with: [
                'adminName' => $this->adminName,
                'adminEmail' => $this->adminEmail,
                'setupUrl' => $this->setupUrl,
                'expiresAt' => $this->expiresAt,
                'temporaryPassword' => $this->temporaryPassword,
                'loginUrl' => $this->loginUrl,
                'isPasswordReset' => $this->isPasswordReset,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}