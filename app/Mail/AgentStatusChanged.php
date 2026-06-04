<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AgentStatusChanged extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly User $agent,
        public readonly string $status,
        public readonly string $message,
        public readonly User $updatedBy,
    ) {
    }

    public function envelope(): Envelope
    {
        $subject = match ($this->status) {
            'verified' => 'Your Agent Account Has Been Verified',
            'suspended' => 'Your Agent Account Has Been Suspended',
            'reactivated' => 'Your Agent Account Has Been Reactivated',
            default => 'Your Agent Account Status Has Changed',
        };

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.agent-status-changed',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
