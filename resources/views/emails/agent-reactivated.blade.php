<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Account Reactivated</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:32px 16px;">
<tr>
<td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06);">

    {{-- Header bar --}}
    <tr>
        <td style="background-color:#16a34a; padding:20px 32px;">
            <span style="color:#ffffff; font-size:14px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase;">
                {{ config('app.name') }}
            </span>
        </td>
    </tr>

    {{-- Body --}}
    <tr>
        <td style="padding:32px;">
            <h1 style="margin:0 0 16px; font-size:20px; font-weight:700; color:#18181b;">
                Account Reactivated ✓
            </h1>

            <p style="margin:0 0 16px; font-size:14px; line-height:1.6; color:#3f3f46;">
                Hi <strong>{{ $agentName }}</strong>,
            </p>

            <p style="margin:0 0 16px; font-size:14px; line-height:1.6; color:#3f3f46;">
                Good news — your agent account on <strong>{{ config('app.name') }}</strong> has been reactivated by an administrator.
            </p>

            <ul style="margin:0 0 24px; padding-left:20px; font-size:14px; line-height:1.8; color:#3f3f46; list-style:none;">
               <li>Re-submit details for verification</li>
                <li>You can log back in to your account</li>
                <li>Your listings are active and visible again</li>
                <li>You can respond to new inquiries as normal</li>
            </ul>

            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                    <td style="border-radius:6px; background-color:#16a34a;">
                        <a href="{{ url('/login') }}" style="display:inline-block; padding:12px 24px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none;">
                            Log In
                        </a>
                    </td>
                </tr>
            </table>

           <p style="margin:0 0 16px; font-size:14px; line-height:1.6; color:#3f3f46;">
                Welcome back!
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
                Account reactivated on {{ now()->format('M d, Y \a\t h:i A') }} by {{ $reactivatedByName }}.
            </p>
        </td>
    </tr>

</table>
</td>
</tr>
</table>
</body>
</html>