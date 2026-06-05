<x-mail::message>
# Listing Approved ✓

Hi **{{ $listing->agent_name ?? 'Agent' }}**,

Excellent news! Your listing has been approved and is now live on **{{ config('app.name') }}**.

**Listing Details:**
- **Title:** {{ $listing->title }}
- **Property Type:** {{ $listing->property_type }}
- **Location:** {{ $listing->city }}, {{ $listing->area }}

@if ($listing->purpose === 'rent')
- **Rental Price:** {{ config('app.currency', 'GHS') }} {{ number_format($listing->rent_min) }} - {{ number_format($listing->rent_max) }} per month
@else
- **Sale Price:** {{ config('app.currency', 'GHS') }} {{ number_format($listing->sale_price) }}
@endif

Your property is now visible to potential tenants and buyers. You can manage inquiries and track views from your dashboard.

<x-mail::button :url="route('agent.listings.show', $listing->id)">
View Listing
</x-mail::button>

If you need to make any changes to your listing, you can edit it anytime from your dashboard.

Thanks,
**{{ config('app.name') }} Team**

<small style="color:#aaa;">Listing approved on {{ now()->format('M d, Y \a\t h:i A') }} by {{ $approvedBy }}.</small>
</x-mail::message>
