<?php

namespace App\Mail;

use App\Models\Rental;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;

class NewListingMail extends Mailable implements ShouldQueue
{
    use Queueable;

    public function __construct(public Rental $rental, public string $body)
    {
    }

    public function build()
    {
        return $this->subject("New listing: {$this->rental->title}")
            ->html($this->body);
    }
}
