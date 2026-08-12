<?php

namespace App\Jobs;

use App\Models\NewsletterSubscriber;
use App\Models\Rental;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\{Log, Mail};
use App\Mail\NewListingMail;
use Illuminate\Support\Str;

class NotifySubscribersOfNewListing implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public Rental $rental)
    {
    }

    public function handle(): void
    {
        $emails = NewsletterSubscriber::active()->pluck('email');

        if ($emails->isEmpty()) {
            return;
        }

        $routeName = $this->rental->purpose === 'sale' ? 'buy.property.show' : 'rent.property.show';

        $listingUrl = route($routeName, [
            'areaSlug' => Str::slug($this->rental->area ?: 'area'),
            'propertySlug' => $this->rental->slug,
        ]);

        $priceLabel = $this->rental->purpose === 'rent'
            ? "GH₵{$this->rental->rent_min} - GH₵{$this->rental->rent_max}/month"
            : "GH₵{$this->rental->sale_price}";

        $body = $this->buildEmailBody($listingUrl, $priceLabel);

        foreach ($emails as $email) {
          Mail::to($email)->queue(new NewListingMail($this->rental, $body));
        }
    }

    private function buildEmailBody(string $listingUrl, string $priceLabel): string
    {
        $title = e($this->rental->title);
        $location = e("{$this->rental->area}, {$this->rental->city}");
        $bedrooms = (int) $this->rental->bedrooms;
        $bathrooms = (int) ($this->rental->bathrooms ?? 0);
        $propertyType = e(ucfirst($this->rental->property_type ?? 'Property'));
        $description = $this->rental->description
            ? e(Str::limit($this->rental->description, 160))
            : null;
        $descriptionBlock = $this->descriptionBlock($description);
        $bedSuffix = $this->pluralSuffix($bedrooms);
        $bathSuffix = $this->pluralSuffix($bathrooms);

        return <<<HTML
        <!DOCTYPE html>
        <html lang="en">
        <body style="margin:0; padding:0; background-color:#0a0908;">
          <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
            {$title} just listed in {$location} &mdash; {$priceLabel}
          </div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0908;">
            <tr>
              <td align="center" style="padding: 40px 16px;">
                <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px; max-width:100%;">

                  <tr>
                    <td align="center" style="padding-bottom: 24px;">
                      <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 700; color: #f5efe6;">
                        RentTrust<span style="color:#e0a838;">Gh</span>
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td style="background-color:#0f0e0c; border:1px solid #262220; border-radius:6px; padding: 32px;">

                      <p style="margin:0 0 16px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; font-size:12px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#e0a838;">
                        New Listing
                      </p>

                      <h1 style="margin:0 0 12px; font-family: Georgia, 'Times New Roman', serif; font-size:22px; font-weight:700; color:#f5efe6; line-height:1.3;">
                        {$title}
                      </h1>

                      <p style="margin:0 0 20px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; font-size:14px; color:#9c948a;">
                        {$location}
                      </p>

                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
                        <tr>
                          <td style="padding-right:18px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; font-size:13px; color:#a89f93;">
                            🛏 {$bedrooms} bed{$bedSuffix}
                          </td>
                          <td style="padding-right:18px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; font-size:13px; color:#a89f93;">
                            🛁 {$bathrooms} bath{$bathSuffix}
                          </td>
                          <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; font-size:13px; color:#a89f93;">
                            {$propertyType}
                          </td>
                        </tr>
                      </table>

                      <p style="margin:0 0 24px; font-family: Georgia, 'Times New Roman', serif; font-size:24px; font-weight:700; color:#e0a838;">
                        {$priceLabel}
                      </p>

                      {$descriptionBlock}

                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="border-radius:6px; background:linear-gradient(135deg, #d9932f, #e0a838);">
                            <a href="{$listingUrl}" style="display:inline-block; padding:14px 32px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; font-size:15px; font-weight:600; color:#0a0908; text-decoration:none;">
                              View Listing
                            </a>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="padding: 24px 20px 0;">
                      <p style="margin:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; font-size:12px; color:#5c554c;">
                        You're receiving this because you subscribed to RentTrustGh listing updates.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        HTML;
    }

    private function descriptionBlock(?string $description): string
    {
        if (!$description) {
            return '';
        }

        return <<<HTML
        <p style="margin:0 0 24px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; font-size:14px; line-height:1.7; color:#a89f93;">
          {$description}
        </p>
        HTML;
    }

    private function pluralSuffix(int $count): string
    {
        return $count === 1 ? '' : 's';
    }

    public function failed(\Throwable $e): void
    {
        Log::error('Failed to notify newsletter subscribers of new listing', [
            'rental_id' => $this->rental->id,
            'error' => $e->getMessage(),
        ]);
    }
}