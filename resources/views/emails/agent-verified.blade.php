<x-mail::message>
# Account Verified ✓

Hi **{{ $agent->name }}**,

Great news! Your agent account on **{{ config('app.name') }}** has been verified and is now fully active.

You can now:
- ✓ Log in to your account
- ✓ Manage your property listings
- ✓ Respond to tenant inquiries
- ✓ Build your agent profile

<x-mail::button :url="route('agent.dashboard')">
Access Your Dashboard
</x-mail::button>

If you have any questions or need assistance getting started, don't hesitate to reach out to our support team.

Thanks,
**{{ config('app.name') }} Team**

<small style="color:#aaa;">Account verified on {{ now()->format('M d, Y \a\t h:i A') }} by {{ $verifiedBy->name }}.</small>
</x-mail::message>
