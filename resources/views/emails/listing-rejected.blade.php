<x-mail::message>
# Listing Rejected

Hi **{{ $listing->agent_name ?? 'Agent' }}**,

We've reviewed your listing submission, and unfortunately, it does not meet our guidelines at this time.

**Listing Details:**
- **Title:** {{ $listing->title }}
- **Property Type:** {{ $listing->property_type }}
- **Location:** {{ $listing->city }}, {{ $listing->area }}

@if ($reason)
**Reason for Rejection:**
{{ $reason }}
@else
**Reason for Rejection:**
Your listing does not meet our quality or content guidelines. Please review the listing requirements and try again.
@endif

**What you can do:**
You can edit your listing to address the issues and resubmit it for review. Make sure your listing includes:
- Clear, accurate property descriptions
- High-quality images
- Correct pricing information
- All required property details

<x-mail::button :url="route('agent.listings.edit', $listing->id)">
Edit & Resubmit Listing
</x-mail::button>

If you have questions about why your listing was rejected or need assistance, please contact our support team.

Thanks,
**{{ config('app.name') }} Team**

<small style="color:#aaa;">Listing rejected on {{ now()->format('M d, Y \a\t h:i A') }} by {{ $rejectedBy }}.</small>
</x-mail::message>
