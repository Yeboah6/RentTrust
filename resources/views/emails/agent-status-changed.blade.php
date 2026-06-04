<x-mail::message>
# Account Status Updated

Hi **{{ $agent->name }},**

{{ $message }}

<x-mail::table>
| Field | Value |
|:------|:------|
| Status | {{ ucfirst($status) }} |
| Updated by | {{ $updatedBy->name ?? 'System' }} |
</x-mail::table>

If you have questions or did not expect this change, please contact support immediately.

<x-mail::button :url="config('app.url')">
Go to Platform
</x-mail::button>

Thanks,
**{{ config('app.name') }} Team**

<small style="color:#aaa;">This is an automated notification. Updated on {{ now()->format('M d, Y \a\t h:i A') }}.</small>
</x-mail::message>
