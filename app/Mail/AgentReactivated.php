<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AgentReactivated extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly User $agent,
        public readonly User $reactivatedBy,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your Agent Account Has Been Reactivated');
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.agent-reactivated',
            with: [
                'agentName' => $this->agent->name,
                'agentEmail' => $this->agent->email,
                'reactivatedByName' => $this->reactivatedBy->name,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
