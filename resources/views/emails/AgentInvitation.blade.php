<!DOCTYPE html>

<html>
    <head>
        <title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
    </head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 35px rgba(15,23,42,.08);">


<!-- Header -->
<tr>
    <td style="background-color:#1e293b;padding:42px 32px;text-align:center;">

        <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;">
            Welcome to RentTrustGH
        </h1>

        <p style="margin:10px 0 0;color:#99f6e4;font-size:14px;">
            Agent Account Invitation
        </p>

    </td>
</tr>

<!-- Body -->
<tr>
    <td style="padding:40px 32px;">

        <h2 style="margin:0 0 16px;color:#0f172a;font-size:22px;">
            Hello {{ $agentName }},
        </h2>

        <p style="margin:0 0 18px;color:#475569;font-size:15px;line-height:1.8;">
            You've been invited to join the RentTrustGH platform as an agent.
            Your account has been prepared and is waiting for activation.
        </p>

        <p style="margin:0 0 28px;color:#475569;font-size:15px;line-height:1.8;">
            Once activated, you'll be able to manage property listings, respond to tenant inquiries,
            build trust through verified profiles, and grow your visibility across Ghana.
        </p>

        <!-- Benefits -->
        <div style="background:#f0fdfa;border:1px solid #ccfbf1;border-radius:12px;padding:18px;margin-bottom:28px;">

            <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#0f766e;">
                Your Agent Account Includes:
            </p>

            <p style="margin:0;font-size:14px;line-height:1.8;color:#134e4a;">
                ✓ Property Listing Management<br>
                ✓ Tenant Inquiry Tracking<br>
                ✓ Verified Agent Profile<br>
                ✓ RentTrustGH Marketplace Access
            </p>

        </div>

        <!-- CTA -->
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center">

                    <a href="{{ $setupUrl }}"
                       style="display:inline-block;padding:15px 34px;background:linear-gradient(135deg,#0f766e,#115e59);color:#ffffff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;">
                        Activate My Agent Account
                    </a>

                </td>
            </tr>
        </table>

    </td>
</tr>

<!-- Expiry Notice -->
<tr>
    <td style="padding:0 32px 28px;">

        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:18px;">

            <p style="margin:0;font-size:14px;color:#9a3412;line-height:1.7;">
                <strong>Invitation Expires</strong><br>
                This activation link expires on
                <strong>{{ $expiresAt }}</strong>.
                If it expires before use, contact the platform administrator to request a new invitation.
            </p>

        </div>

    </td>
</tr>

<!-- Security Notice -->
<tr>
    <td style="padding:0 32px 28px;">

        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px;">

            <p style="margin:0;font-size:14px;color:#475569;line-height:1.7;">
                <strong>Security Notice</strong><br>
                If you did not expect this invitation, you can safely ignore this email.
                Your account will not be activated unless you complete the setup process.
            </p>

        </div>

    </td>
</tr>

<!-- Fallback URL -->
<tr>
    <td style="padding:0 32px 32px;">

        <p style="font-size:13px;color:#64748b;margin:0 0 10px;">
            Having trouble with the button?
        </p>

        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;font-size:12px;color:#475569;word-break:break-all;">
            {{ $setupUrl }}
        </div>

    </td>
</tr>

<!-- Footer -->
<tr>
    <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 32px;text-align:center;">

        <p style="margin:0;font-size:13px;color:#64748b;">
            © {{ date('Y') }} RentTrustGH
        </p>

        <p style="margin:8px 0 0;font-size:12px;color:#94a3b8;">
            Ghana's Trusted Rental Verification Platform
        </p>

    </td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
