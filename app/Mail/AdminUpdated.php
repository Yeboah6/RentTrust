<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $adminName,
        public readonly string $adminEmail,
        public readonly string $updatedBy,
        public readonly array  $changes = [],
    ) {}

    public function envelope(): Envelope
    {
        $subject = 'Your administrator account was updated';

        return new Envelope(
            subject: $subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.AdminUpdated',
            with: [
                'adminName' => $this->adminName,
                'adminEmail' => $this->adminEmail,
                'updatedBy' => $this->updatedBy,
                'changes' => $this->changes,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
