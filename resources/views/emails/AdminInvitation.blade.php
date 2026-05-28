<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RentTrustGh - {{ $isPasswordReset ? 'Password Reset' : 'Login Invitation' }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #2d3748;
            background: #f5f7fa;
        }

        .email-container {
            max-width: 600px;
            width: 100%;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
            overflow: hidden;
        }

        .email-header {
            background: linear-gradient(135deg, #1a365d 0%, #2d5a8c 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }

        .logo {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }

        .tagline {
            font-size: 13px;
            opacity: 0.9;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .email-body {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 16px;
        }

        .message {
            font-size: 15px;
            color: #4a5568;
            margin-bottom: 24px;
            line-height: 1.7;
        }

        .highlight {
            color: #2d5a8c;
            font-weight: 600;
        }

        .credentials-box {
            background: #f7fafc;
            border-left: 4px solid #2d5a8c;
            padding: 20px;
            margin: 30px 0;
            border-radius: 8px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 14px;
        }

        .credential-item {
            margin-bottom: 12px;
        }

        .credential-item:last-child {
            margin-bottom: 0;
        }

        .credential-label {
            font-weight: 600;
            color: #2d5a8c;
            display: block;
            margin-bottom: 4px;
        }

        .credential-value {
            color: #1a202c;
            word-break: break-all;
            padding-left: 12px;
            border-left: 2px solid #cbd5e0;
        }

        .cta-button-wrapper {
            text-align: center;
            margin: 35px 0;
        }

        .cta-button {
            display: inline-block;
            padding: 14px 40px;
            background: linear-gradient(135deg, #2d5a8c 0%, #1a365d 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(45, 90, 140, 0.3);
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(45, 90, 140, 0.4);
        }

        .security-note {
            background: #fffaf0;
            border: 1px solid #fed7d7;
            border-radius: 8px;
            padding: 16px;
            margin: 25px 0;
            font-size: 13px;
            color: #742a2a;
        }

        .security-note strong {
            display: block;
            margin-bottom: 6px;
            color: #c53030;
        }

        .security-note ul {
            list-style: none;
            padding-left: 0;
        }

        .security-note li {
            margin-bottom: 4px;
        }

        .email-footer {
            background: #f7fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }

        .footer-text {
            font-size: 13px;
            color: #718096;
            margin-bottom: 12px;
            line-height: 1.6;
        }

        .footer-link {
            color: #2d5a8c;
            text-decoration: none;
            font-weight: 600;
        }

        .divider {
            height: 1px;
            background: #e2e8f0;
            margin: 12px 0;
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 15px;
        }

        .social-link {
            display: inline-block;
            width: 36px;
            height: 36px;
            background: #e2e8f0;
            border-radius: 50%;
            text-align: center;
            line-height: 36px;
            text-decoration: none;
            color: #2d5a8c;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        .social-link:hover {
            background: #2d5a8c;
            color: white;
        }

        @media (max-width: 600px) {
            .email-header {
                padding: 30px 20px;
            }

            .email-body {
                padding: 25px 20px;
            }

            .greeting {
                font-size: 18px;
            }

            .message {
                font-size: 14px;
            }

            .cta-button {
                padding: 12px 30px;
                font-size: 14px;
            }

            .email-footer {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <table style="width: 100%; background: #f5f7fa; padding: 20px 0;">
        <tr>
            <td align="center">
                <div class="email-container">
                    <!-- Header -->
                    <div class="email-header">
                        <div class="logo">RentTrust</div>
                        <div class="tagline">Admin Dashboard</div>
                    </div>

                    <!-- Main Content -->
                    <div class="email-body">
                        @if($isPasswordReset)
                            <div class="greeting">Password Reset - RentTrust Admin</div>
                            <div class="message">
                                Your admin password has been reset. You can now log in using the new credentials below.
                            </div>
                        @else
                            <div class="greeting">Welcome to RentTrust Admin, {{ $adminName }}!</div>
                            <div class="message">
                                You have been invited to join the <span class="highlight">RentTrust Admin Dashboard</span>. 
                                As an administrator, you'll have access to manage properties, users, and platform settings to help 
                                grow our rental marketplace.
                            </div>
                            <div class="message">
                                Your login credentials have been securely created and are ready for use. Please log in to your 
                                admin account using the details below.
                            </div>
                        @endif

                        <!-- Credentials -->
                        <div class="credentials-box">
                            <div class="credential-item">
                                <span class="credential-label">Email:</span>
                                <span class="credential-value">{{ $adminEmail }}</span>
                            </div>
                            <div class="credential-item">
                                <span class="credential-label">Password:</span>
                                <span class="credential-value">{{ $temporaryPassword }}</span>
                            </div>
                        </div>

                        <!-- CTA Button -->
                        <div class="cta-button-wrapper">
                            <a href="{{ $loginUrl }}" class="cta-button">Log In to Dashboard</a>
                        </div>

                        <!-- Security Note -->
                        <div class="security-note">
                            <strong>🔒 Security Reminder</strong>
                            <ul>
                                <li>✓ Change your password immediately upon first login</li>
                                <li>✓ Never share your credentials with others</li>
                                <li>✓ Always use a secure connection (HTTPS)</li>
                                <li>✓ Log out when finished using the dashboard</li>
                            </ul>
                        </div>

                        <!-- Help Text -->
                        <div class="message">
                            If you experience any issues logging in or have questions about your admin access, 
                            please don't hesitate to contact our support team at <span class="highlight">support@renttrust.com</span>.
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="email-footer">
                        <div class="footer-text">
                            <strong>RentTrust Admin Platform</strong>
                        </div>
                        <div class="footer-text">
                            © {{ now()->year }} RentTrust. All rights reserved.
                        </div>

                        <div class="divider"></div>

                        <div class="footer-text">
                            <a href="https://www.renttrust.com" class="footer-link">Visit Website</a> • 
                            <a href="https://support.renttrust.com" class="footer-link">Get Help</a> • 
                            <a href="https://www.renttrust.com/privacy" class="footer-link">Privacy Policy</a>
                        </div>

                        <div class="social-links">
                            <a href="https://www.instagram.com/renttrustgh" class="social-link" title="Instagram">📷</a>
                            <a href="https://www.tiktok.com/@renttrustgh" class="social-link" title="TikTok">🎵</a>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>