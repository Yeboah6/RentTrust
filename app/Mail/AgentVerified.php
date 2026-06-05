<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AgentVerified extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly User $agent,
        public readonly User $verifiedBy,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your Agent Account Has Been Verified');
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.agent-verified',
            with: [
                'agent' => $this->agent,
                'verifiedBy' => $this->verifiedBy,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
