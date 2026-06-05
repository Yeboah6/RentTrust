<x-mail::message>
# Listing Verification Rejected

Hi **{{ $verificationRequest->agent->name ?? 'Agent' }}**,

Thank you for submitting your listing for verification. After careful review, we're unable to approve it at this time.

**Listing:** {{ $verificationRequest->rental->title }}

@if ($rejectionReason)
**Reason:**
{{ $rejectionReason }}
@else
**Reason:**
Your submission does not meet our verification requirements. This may be due to incomplete documentation, image quality issues, or missing property details.
@endif

**What you can do:**
- Review the verification requirements
- Update your listing with more detailed information
- Provide additional or clearer property images
- Resubmit for verification

Our verification process ensures trust and transparency on our platform. If you have questions about the requirements or need clarification, please don't hesitate to contact our support team.

<x-mail::button :url="route('agent.listings.edit', $verificationRequest->rental->id)">
Update Your Listing
</x-mail::button>

We encourage you to try again after making improvements to your listing.

Thanks,
**{{ config('app.name') }} Team**

<small style="color:#aaa;">Verification rejected on {{ now()->format('M d, Y \a\t h:i A') }} by {{ $rejectedBy }}.</small>
</x-mail::message>
