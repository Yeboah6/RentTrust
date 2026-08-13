<!DOCTYPE html>

<html>
<head>
    <meta charset="utf-8">
    <title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
</head>

<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr>
        <td align="center">

            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,42,0.08);">

                <!-- Header -->
                <tr>
                    <td style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:40px 32px;text-align:center;">

                        <img
                            src="/rent-trust.png"
                            alt="RentTrustGh"
                            width="70"
                            style="display:block;margin:0 auto 16px;"
                        >

                        <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;">
                            Welcome to RentTrustGh
                        </h1>

                        <p style="margin:12px 0 0;color:#cbd5e1;font-size:15px;">
                            Admin Portal Invitation
                        </p>

                    </td>
                </tr>

                <!-- Content -->
                <tr>
                    <td style="padding:40px 32px;">

                        <p style="margin:0 0 16px;font-size:16px;color:#0f172a;font-weight:600;">
                            Hello {{ $adminName }},
                        </p>

                        @if($isPasswordReset)
                            <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:#475569;">
                                Your administrator password on RentTrustGh has been reset. Use the temporary password below to sign in,
                                then update your password from your account settings.
                            </p>

                            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px;margin-bottom:28px;">
                                <p style="margin:0;font-size:14px;color:#64748b;">
                                    <strong>Account Email</strong><br>
                                    {{ $adminEmail }}
                                </p>
                                <p style="margin:16px 0 0;font-size:14px;color:#64748b;">
                                    <strong>Temporary Password</strong><br>
                                    {{ $temporaryPassword ?? 'Not provided' }}
                                </p>
                            </div>

                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">

                                        <a href="{{ $loginUrl ?? url('/') }}"
                                           style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:15px 32px;border-radius:10px;font-weight:700;font-size:15px;">
                                            Sign in to RentTrustGh
                                        </a>

                                    </td>
                                </tr>
                            </table>

                            <p style="margin:28px 0 0;font-size:14px;color:#64748b;line-height:1.7;">
                                If you did not request this reset, please contact a Super Admin immediately.
                            </p>
                        @else
                            <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:#475569;">
                                You've been invited to join the RentTrustGh administration portal.
                                To activate your account, create your password using the secure button below.
                            </p>

                            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px;margin-bottom:28px;">
                                <p style="margin:0;font-size:14px;color:#64748b;">
                                    <strong>Account Email</strong><br>
                                    {{ $adminEmail }}
                                </p>
                            </div>

                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">

                                        <a href="{{ $setupUrl }}"
                                           style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:15px 32px;border-radius:10px;font-weight:700;font-size:15px;">
                                            Create Password & Activate Account
                                        </a>

                                    </td>
                                </tr>
                            </table>

                            <p style="margin:28px 0 0;font-size:14px;color:#64748b;line-height:1.7;">
                                This secure invitation link can only be used once and will expire in
                                <strong>{{ $expiresAt ?? '24 hours' }}</strong>.
                            </p>
                        @endif

                    </td>
                </tr>

                <!-- Security Notice -->
                <tr>
                    <td style="padding:0 32px 32px;">

                        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:18px;">
                            <p style="margin:0;font-size:14px;line-height:1.7;color:#9a3412;">
                                <strong>Security Notice</strong><br>
                                If you did not expect this invitation, you can safely ignore this email.
                                No account will be activated unless the setup process is completed.
                            </p>
                        </div>

                    </td>
                </tr>

                <!-- Fallback URL -->
                <tr>
                    <td style="padding:0 32px 32px;">

                        <p style="font-size:13px;color:#64748b;line-height:1.6;">
                            Having trouble with the button?
                            Copy and paste the link below into your browser:
                        </p>

                        <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:12px;border-radius:10px;word-break:break-all;font-size:12px;color:#475569;">
                            {{ $setupUrl }}
                        </div>

                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="background:#f8fafc;padding:24px 32px;text-align:center;border-top:1px solid #e2e8f0;">

                        <p style="margin:0;font-size:13px;color:#64748b;">
                            © {{ date('Y') }} RentTrustGh
                        </p>

                        <p style="margin:8px 0 0;font-size:12px;color:#94a3b8;">
                            Trusted Rental Verification Platform
                        </p>

                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>

</body>
</html>
