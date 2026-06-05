<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AgentSuspended extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly User $agent,
        public readonly User $suspendedBy,
        public readonly ?string $reason = null,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your Agent Account Has Been Suspended');
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.agent-suspended',
            with: [
                'agent' => $this->agent,
                'suspendedBy' => $this->suspendedBy,
                'reason' => $this->reason,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
