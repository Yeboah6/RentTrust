<x-mail::message>
# Account Deleted

Hi **{{ $agentName }}**,

Your agent account on **{{ config('app.name') }}** has been permanently deleted by an administrator.

**What has been removed:**
- Your agent profile
- All your property listings
- All associated data and inquiries

**If you believe this was an error:**
Please contact our support team immediately with details about your account.

<x-mail::button :url="route('contact.support')" color="danger">
Contact Support
</x-mail::button>

If you need to create a new account in the future, you're welcome to register again.

Thanks,
**{{ config('app.name') }} Team**

<small style="color:#aaa;">Account deleted on {{ now()->format('M d, Y \a\t h:i A') }} by {{ $deletedBy }}.</small>
</x-mail::message>
