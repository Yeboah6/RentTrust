<x-mail::message>
# Account Suspended

Hi **{{ $agent->name }}**,

Your agent account on **{{ config('app.name') }}** has been suspended by an administrator.

**What this means:**
- You will not be able to log in to your account
- Your active listings have been temporarily suspended
- You won't be able to respond to new inquiries

@if ($reason)
**Reason:**
{{ $reason }}
@endif

**Next Steps:**
If you believe this was done in error or would like to discuss this matter, please contact our support team immediately.

<x-mail::button :url="route('contact.support')" color="danger">
Contact Support
</x-mail::button>

We're here to help resolve this.

Thanks,
**{{ config('app.name') }} Team**

<small style="color:#aaa;">Account suspended on {{ now()->format('M d, Y \a\t h:i A') }} by {{ $suspendedBy->name }}.</small>
</x-mail::message>
