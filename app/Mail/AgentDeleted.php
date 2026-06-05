<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AgentDeleted extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $agentName,
        public readonly string $agentEmail,
        public readonly string $deletedBy,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your Agent Account Has Been Deleted');
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.agent-deleted',
            with: [
                'agentName' => $this->agentName,
                'agentEmail' => $this->agentEmail,
                'deletedBy' => $this->deletedBy,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
