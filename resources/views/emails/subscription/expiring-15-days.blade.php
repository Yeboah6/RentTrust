<!DOCTYPE html>
<html>
<head>
    <title>Subscription Expiring Soon</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4a90e2;">Your Subscription is Expiring Soon</h2>
        
        <p>Hello {{ $userName }},</p>
        
        <p>We wanted to let you know that your <strong>{{ $planName }}</strong> subscription 
           will expire on <strong>{{ $endDate }}</strong>.</p>
        
        <p>You have <strong>{{ $daysLeft }} days</strong> remaining. Renew your subscription 
           to continue enjoying uninterrupted access to our services.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $renewUrl }}" 
               style="background-color: #4a90e2; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
                Renew Now
            </a>
        </div>
        
        <p>If you have any questions, please don't hesitate to contact us.</p>
        
        <p>Best regards,<br>Your Support Team</p>
    </div>
</body>
</html>