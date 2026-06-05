<x-mail::message>
# Account Updated

Hi **{{ $agent->name }}**,

Your agent account on **{{ config('app.name') }}** was updated by **{{ $updatedBy->name }}**.

@if (!empty($changedFields))
**The following details were changed:**

<x-mail::table>
| Field | From | To |
|:------|:-----|:---|
@foreach ($changedFields as $field => $update)
| {{ ucfirst(str_replace('_', ' ', $field)) }} | {{ $field === 'password' ? '••••••••' : ($update['from'] ?? '—') }} | {{ $field === 'password' ? '(changed)' : ($update['to'] ?? '—') }} |
@endforeach
</x-mail::table>
@endif

If you made this request or are aware of these changes, no action is needed.

If you did **not** expect this change, please contact support immediately.

<x-mail::button :url="config('app.url')">
Go to Platform
</x-mail::button>

Thanks,
**{{ config('app.name') }} Team**

<small style="color:#aaa;">This is an automated notification. Updated on {{ now()->format('M d, Y \a\t h:i A') }} by {{ $updatedBy->name }}.</small>
</x-mail::message>