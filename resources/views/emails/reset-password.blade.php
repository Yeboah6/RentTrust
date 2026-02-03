<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }
        h1 {
            color: #1a202c;
            font-size: 24px;
            margin: 0 0 10px;
        }
        .subtitle {
            color: #718096;
            font-size: 14px;
            margin: 0;
        }
        .content {
            margin: 30px 0;
        }
        .greeting {
            font-size: 16px;
            margin-bottom: 20px;
        }
        .message {
            font-size: 14px;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.8;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .reset-button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .reset-button:hover {
            background: linear-gradient(135deg, #5a67d8 0%, #6b3fa0 100%);
        }
        .info-box {
            background-color: #edf2f7;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .info-box p {
            margin: 5px 0;
            font-size: 13px;
            color: #4a5568;
        }
        .link-container {
            background-color: #f7fafc;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            word-break: break-all;
        }
        .link-text {
            font-size: 12px;
            color: #718096;
            margin-bottom: 8px;
        }
        .link-url {
            font-size: 13px;
            color: #667eea;
            word-wrap: break-word;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            font-size: 12px;
            color: #a0aec0;
            margin: 5px 0;
        }
        .warning {
            background-color: #fff5f5;
            border-left: 4px solid #fc8181;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .warning p {
            margin: 5px 0;
            font-size: 13px;
            color: #742a2a;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </div>
            <h1>Password Reset Request</h1>
            <p class="subtitle">Secure your account with a new password</p>
        </div>

        <div class="content">
            <p class="greeting">Hello {{ $userName }},</p>

            <p class="message">
                We received a request to reset the password for your account. If you made this request, 
                click the button below to choose a new password. If you didn't request a password reset, 
                you can safely ignore this email.
            </p>

            <div class="button-container">
                <a href="{{ $resetUrl }}" class="reset-button">Reset Password</a>
            </div>

            <div class="info-box">
                <p><strong>⏰ This link will expire in 24 hours</strong></p>
                <p>Expires at: {{ $expiresAt }}</p>
            </div>

            <p class="message">
                If the button doesn't work, you can copy and paste the following link into your browser:
            </p>

            <div class="link-container">
                <p class="link-text">Reset Link:</p>
                <a href="{{ $resetUrl }}" class="link-url">{{ $resetUrl }}</a>
            </div>

            <div class="warning">
                <p><strong>🔒 Security Tips:</strong></p>
                <p>• Never share this link with anyone</p>
                <p>• Make sure you're on the correct website before entering your password</p>
                <p>• Use a strong, unique password</p>
            </div>

            <p class="message">
                If you didn't request a password reset, please ignore this email or contact support if you 
                have concerns about your account security.
            </p>
        </div>

        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
            <p>Need help? Contact our support team.</p>
        </div>
    </div>
</body>
</html>