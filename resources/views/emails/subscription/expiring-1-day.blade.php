<!DOCTYPE html>
<html>
<head>
    <title>Final Notice - Subscription Expires Tomorrow</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 5px;">
            <h2 style="margin: 0;">⚠️ Final Reminder</h2>
        </div>
        
        <p>Hello {{ $userName }},</p>
        
        <p>This is your final reminder that your <strong>{{ $planName }}</strong> subscription 
           will expire <strong>tomorrow</strong> on {{ $endDate }}.</p>
        
        <p>Your account will be downgraded to the free plan, and you will lose access to:</p>
        
        <ul>
            <li>Premium listings</li>
            <li>Priority placement</li>
            <li>Advanced features</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ $renewUrl }}" 
               style="background-color: #e74c3c; color: white; padding: 15px 40px; 
                      text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Renew Immediately
            </a>
        </div>
        
        <p style="color: #e74c3c;"><strong>Act now to avoid service interruption!</strong></p>
        
        <p>Best regards,<br>Your Support Team</p>
    </div>
</body>
</html>