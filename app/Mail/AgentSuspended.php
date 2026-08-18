<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
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
        public readonly string $status,
        public readonly ?string $reason = null,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->status === 'suspended'
                ? 'Your Agent Account Has Been Suspended'
                : 'Your Agent Account Has Been Reactivated',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.agent-suspended',
            with: [
                'agentName' => $this->agent->name,
                'agentEmail' => $this->agent->email,
                'suspendedByName' => $this->suspendedBy->name,
                'status' => $this->status,
                'reason' => $this->reason,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}