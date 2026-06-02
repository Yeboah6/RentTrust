<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 35px rgba(15,23,42,.08);">


<!-- Header -->
<tr>
    <td style="background:linear-gradient(135deg,#0f766e,#115e59);padding:42px 32px;text-align:center;">

        <img
            src="{{ asset('rent-trust.png') }}"
            alt="RentTrustGH"
            width="72"
            style="display:block;margin:0 auto 16px;"
        >

        <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;">
            Welcome to RentTrustGH!
        </h1>

        <p style="margin:10px 0 0;color:#99f6e4;font-size:14px;">
            Your {{ $agentType }} Account is Ready
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
            Thank you for registering with RentTrustGH! Your {{ $agentType }} account has been successfully created
            and is ready to use.
        </p>

        <p style="margin:0 0 28px;color:#475569;font-size:15px;line-height:1.8;">
            You can now access your dashboard to manage property listings, connect with tenants, and build your reputation
            on Ghana's leading property rental platform.
        </p>

        <!-- Account Details -->
        <div style="background:#f0fdfa;border:1px solid #ccfbf1;border-radius:12px;padding:18px;margin-bottom:28px;">

            <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#0f766e;">
                Account Information:
            </p>

            <p style="margin:0;font-size:14px;line-height:1.8;color:#134e4a;">
                <strong>Account Type:</strong> {{ $agentType }}<br>
                <strong>Email:</strong> {{ $agentEmail }}<br>
                <strong>Status:</strong> Pending Verification
            </p>

        </div>

        <!-- Benefits -->
        <div style="background:#f5f3ff;border:1px solid #e9d5ff;border-radius:12px;padding:18px;margin-bottom:28px;">

            <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#6b21a8;">
                What You Can Do Now:
            </p>

            <p style="margin:0;font-size:14px;line-height:1.8;color:#581c87;">
                ✓ Complete Your Profile Verification<br>
                ✓ Upload Property Listings<br>
                ✓ Respond to Tenant Inquiries<br>
                ✓ Track Your Performance Metrics<br>
                ✓ Choose Your Subscription Plan
            </p>

        </div>

        <!-- CTA -->
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center">

                    <a href="{{ $dashboardUrl }}"
                       style="display:inline-block;padding:15px 34px;background:linear-gradient(135deg,#0f766e,#115e59);color:#ffffff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;margin-bottom:16px;">
                        Go to My Dashboard
                    </a>

                </td>
            </tr>
        </table>

        <!-- Verification Notice -->
        <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:12px;padding:18px;margin-top:28px;">

            <p style="margin:0;font-size:14px;color:#92400e;line-height:1.7;">
                <strong>📋 Next Step:</strong><br>
                Complete your profile verification to unlock the verified agent badge and gain full access to all features.
                This helps tenants trust your profile and improves your visibility on the platform.
            </p>

        </div>

    </td>
</tr>

<!-- Footer -->
<tr>
    <td style="padding:28px 32px;border-top:1px solid #e2e8f0;">

        <p style="margin:0 0 12px;font-size:13px;color:#64748b;text-align:center;line-height:1.6;">
            Questions? We're here to help!<br>
            Contact our support team at <a href="mailto:renttrust2026@gmail.com" style="color:#0f766e;text-decoration:none;">renttrust2026@gmail.com</a>
        </p>

        <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
            © 2026 RentTrustGH. All rights reserved.
        </p>

    </td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
