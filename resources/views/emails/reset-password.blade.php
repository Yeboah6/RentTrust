<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light dark">
<title>Reset your RentTrustGh password</title>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
<style>
  body, table, td { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
  body { margin: 0; padding: 0; width: 100% !important; background-color: #0a0908; }

  a.reset-button:hover { filter: brightness(1.08); }

  @media only screen and (max-width: 600px) {
    .email-wrapper { width: 100% !important; }
    .email-padding { padding-left: 20px !important; padding-right: 20px !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#0a0908;">

<!-- Preheader (hidden preview text) -->
<div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    A link to reset your RentTrustGh password &mdash; expires in 24 hours.
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0908;">
<tr>
<td align="center" style="padding: 40px 16px;">

  <table role="presentation" class="email-wrapper" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px; max-width:100%;">

    <!-- Wordmark -->
    <tr>
      <td align="center" style="padding-bottom: 28px;">
        <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 700; letter-spacing: 0.3px; color: #f5efe6;">
          RentTrust<span style="color: #e0a838;">Gh</span>
        </span>
      </td>
    </tr>

    <!-- Card -->
    <tr>
      <td class="email-padding" style="background-color:#0f0e0c; border: 1px solid #262220; border-radius: 6px; padding: 44px 40px;">

        <!-- Icon -->
        {{-- <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin-bottom: 24px;">
          <tr>
            <td width="52" height="52" align="center" valign="middle" style="background: linear-gradient(135deg, #d9932f, #e0a838); border-radius: 8px;">
              <!--[if mso]><span style="font-family: Arial, sans-serif; font-size:22px; color:#0a0908;">&#128274;</span><![endif]-->
              <!--[if !mso]><!-->
              {{-- <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a0908" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              {{-- </svg> 
              <!--<![endif]-->
            </td>
          </tr>
        </table> --}}

        <!-- Heading -->
        <h1 style="margin: 0 0 8px; text-align: center; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 700; color: #f5efe6;">
          Reset your password
        </h1>
        <p style="margin: 0 0 32px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; color: #9c948a;">
          Let's get you back into your account.
        </p>

        <p style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #d8d2c8;">
          Hello {{ $userName }},
        </p>

        <p style="margin: 0 0 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; line-height: 1.7; color: #a89f93;">
          We received a request to reset the password for your RentTrustGh account. If this was you, click the button below to choose a new password. If you didn't request this, you can safely ignore this email &mdash; your password won't be changed.
        </p>

        <!-- Button -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 0 28px;">
          <tr>
            <td align="center" style="border-radius: 6px; background: linear-gradient(135deg, #d9932f, #e0a838);">
              <a href="{{ $resetUrl }}" class="reset-button" style="display: inline-block; padding: 14px 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; font-weight: 600; color: #0a0908; text-decoration: none;">
                Reset Password
              </a>
            </td>
          </tr>
        </table>

        <!-- Expiry notice -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #17140f; border-left: 3px solid #e0a838; border-radius: 4px; margin: 0 0 24px;">
          <tr>
            <td style="padding: 14px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; color: #cbb98a; line-height: 1.6;">
              <strong>&#9200; This link expires in 24 hours</strong><br>
              Expires at: {{ $expiresAt }}
            </td>
          </tr>
        </table>

        <p style="margin: 0 0 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; color: #7d7468;">
          If the button doesn't work, copy and paste this link into your browser:
        </p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #17140f; border-radius: 4px; margin: 0 0 24px;">
          <tr>
            <td style="padding: 14px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 12px; color: #e0a838; word-break: break-all;">
              <a href="{{ $resetUrl }}" style="color: #e0a838; text-decoration: none;">{{ $resetUrl }}</a>
            </td>
          </tr>
        </table>

        <!-- Security tips -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1a1210; border-left: 3px solid #b5543f; border-radius: 4px;">
          <tr>
            <td style="padding: 14px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; color: #c9a89d; line-height: 1.8;">
              <strong style="color: #d99a86;">&#128274; Security tips</strong><br>
              &bull; Never share this link with anyone<br>
              &bull; Confirm you're on renttrustgh.com before entering your password<br>
              &bull; Use a strong, unique password
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" style="padding: 28px 20px 0;">
        <p style="margin: 0 0 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 12px; color: #5c554c;">
          This is an automated message, please don't reply to this email.
        </p>
        <p style="margin: 0 0 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 12px; color: #5c554c;">
          &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </p>
        <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 12px; color: #5c554c;">
          Need help? Contact our support team.
        </p>
      </td>
    </tr>

  </table>

</td>
</tr>
</table>

</body>
</html>