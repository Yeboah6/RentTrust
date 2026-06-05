<x-mail::message>
# Account Reactivated ✓

Hi **{{ $agent->name }}**,

Your agent account on **{{ config('app.name') }}** has been reactivated and is now active again.

**What's been restored:**
- ✓ Full account access
- ✓ Your active listings have been restored
- ✓ Ability to respond to inquiries

<x-mail::button :url="route('agent.dashboard')">
Return to Dashboard
</x-mail::button>

Thank you for working with us. If you have any questions, our support team is always happy to help.

Thanks,
**{{ config('app.name') }} Team**

<small style="color:#aaa;">Account reactivated on {{ now()->format('M d, Y \a\t h:i A') }} by {{ $reactivatedBy->name }}.</small>
</x-mail::message>
