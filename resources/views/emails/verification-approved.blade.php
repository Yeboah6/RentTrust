<x-mail::message>
# Listing Verification Approved ✓

Hi **{{ $verificationRequest->agent->name ?? 'Agent' }}**,

Great news! Your listing verification has been approved.

**Listing:** {{ $verificationRequest->rental->title }}

Your property has been verified and you can now enjoy all the benefits of a verified listing:
- ✓ Higher visibility in search results
- ✓ Increased buyer/tenant trust
- ✓ "Verified" badge on your listing
- ✓ Priority placement in featured sections

<x-mail::button :url="route('agent.listings.show', $verificationRequest->rental->id)">
View Your Verified Listing
</x-mail::button>

Thank you for providing comprehensive property information and documentation. If you have any questions, feel free to reach out to our support team.

Thanks,
**{{ config('app.name') }} Team**

<small style="color:#aaa;">Verification approved on {{ now()->format('M d, Y \a\t h:i A') }} by {{ $approvedBy }}.</small>
</x-mail::message>
