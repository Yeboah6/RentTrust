<!DOCTYPE html>
<html>
<head>
    <title>1 Week Left - Subscription Expiring</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f39c12;">Only 1 Week Left!</h2>
        
        <p>Hello {{ $userName }},</p>
        
        <p>Your <strong>{{ $planName }}</strong> subscription is expiring in just 
           <strong>{{ $daysLeft }} days</strong> on {{ $endDate }}.</p>
        
        <p>Don't lose access to your premium features! Renew now to continue enjoying:</p>
        
        <ul>
            <li>Unlimited listings</li>
            <li>Priority ranking</li>
            <li>Advanced analytics</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $renewUrl }}" 
               style="background-color: #f39c12; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
                Renew Now
            </a>
        </div>
        
        <p>Need help? Our support team is ready to assist you.</p>
        
        <p>Best regards,<br>Your Support Team</p>
    </div>
</body>
</html>