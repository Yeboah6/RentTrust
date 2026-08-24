<?php

namespace App\Mail;

use App\Models\ListingVerification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ListingVerificationSubmitted extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public ListingVerification $verification)
    {
    }

    public function build()
    {
        return $this
            ->subject('New Listing Verification Request: ' . $this->verification->property_title)
            ->html($this->buildBody());
    }

    protected function buildBody(): string
    {
        $v = $this->verification;

        return <<<HTML
            <p>A new listing verification request has been submitted.</p>
            <ul>
                <li><strong>Listing ID:</strong> {$v->listing_id}</li>
                <li><strong>Property:</strong> {$v->property_title}</li>
                <li><strong>Address:</strong> {$v->property_address}</li>
                <li><strong>Availability:</strong> {$v->availability_status}</li>
                <li><strong>Submitted at:</strong> {$v->submitted_at}</li>
            </ul>
        HTML;
    }
}