<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:32px 16px;">
<tr>
<td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06);">

    {{-- Header bar --}}
    <tr>
        <td style="background-color:#2563eb; padding:20px 32px;">
            <span style="color:#ffffff; font-size:14px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase;">
                {{ config('app.name') }}
            </span>
        </td>
    </tr>

    {{-- Body --}}
    <tr>
        <td style="padding:32px;">
            <h1 style="margin:0 0 16px; font-size:20px; font-weight:700; color:#18181b;">
                Account Updated
            </h1>

            <p style="margin:0 0 16px; font-size:14px; line-height:1.6; color:#3f3f46;">
                Hi <strong>{{ $agentName }}</strong>,
            </p>

            <p style="margin:0 0 16px; font-size:14px; line-height:1.6; color:#3f3f46;">
                Your agent account on <strong>{{ config('app.name') }}</strong> was updated by an administrator.
            </p>

            @if (!empty($changedFields))
            <p style="margin:0 0 8px; font-size:14px; font-weight:700; color:#18181b;">
                The following details were changed:
            </p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px; border:1px solid #e4e4e7; border-radius:6px; overflow:hidden;">
                <tr style="background-color:#f4f4f5;">
                    <td style="padding:8px 12px; font-size:12px; font-weight:700; color:#52525b; text-transform:uppercase; letter-spacing:0.03em; border-bottom:1px solid #e4e4e7;">Field</td>
                    <td style="padding:8px 12px; font-size:12px; font-weight:700; color:#52525b; text-transform:uppercase; letter-spacing:0.03em; border-bottom:1px solid #e4e4e7;">From</td>
                    <td style="padding:8px 12px; font-size:12px; font-weight:700; color:#52525b; text-transform:uppercase; letter-spacing:0.03em; border-bottom:1px solid #e4e4e7;">To</td>
                </tr>
                @foreach ($changedFields as $field => $update)
                <tr>
                    <td style="padding:10px 12px; font-size:13px; color:#18181b; border-bottom:1px solid #f0f0f0;">{{ ucfirst(str_replace('_', ' ', $field)) }}</td>
                    <td style="padding:10px 12px; font-size:13px; color:#71717a; border-bottom:1px solid #f0f0f0;">{{ $update['from'] ?? '' }}</td>
                    <td style="padding:10px 12px; font-size:13px; color:#18181b; font-weight:600; border-bottom:1px solid #f0f0f0;">{{ $update['to'] ?? '' }}</td>
                </tr>
                @endforeach
            </table>
            @endif

            <p style="margin:0 0 16px; font-size:14px; line-height:1.6; color:#3f3f46;">
                If you made this request or are aware of this change, no action is needed.
            </p>

            <p style="margin:0 0 24px; font-size:14px; line-height:1.6; color:#3f3f46;">
                If you did <strong>not</strong> expect this change, please contact support immediately.
            </p>

            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                    <td style="border-radius:6px; background-color:#2563eb;">
                        <a href="{{ config('app.url') }}" style="display:inline-block; padding:12px 24px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none;">
                            Go to Platform
                        </a>
                    </td>
                </tr>
            </table>

            <p style="margin:0 0 16px; font-size:14px; line-height:1.6; color:#3f3f46;">
                For any concerns, reply to this email or contact our support team.
            </p>

            <p style="margin:0; font-size:14px; line-height:1.6; color:#3f3f46;">
                Thanks,<br>
                <strong>{{ config('app.name') }} Team</strong>
            </p>
        </td>
    </tr>

    {{-- Footer --}}
    <tr>
        <td style="padding:16px 32px 24px; border-top:1px solid #f0f0f0;">
            <p style="margin:0; font-size:12px; color:#a1a1aa;">
                This is an automated notification. Updated on {{ now()->format('M d, Y \a\t h:i A') }} by an RentTrustGh.
            </p>
        </td>
    </tr>

</table>
</td>
</tr>
</table>
</body>
</html>