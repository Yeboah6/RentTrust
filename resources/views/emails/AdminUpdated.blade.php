<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>RentTrustGh | Ghana's Trusted Property Marketplace</title>
</head>
<body style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #111; line-height:1.45;">
  <h2 style="margin-bottom:0.25rem;">Hello {{ $adminName }},</h2>

  <p>Your administrator account on RentTrustGH was updated by <strong>{{ $updatedBy }}</strong>.</p>

  @if(!empty($changes))
    <p>Summary of changes:</p>
    <ul>
      @foreach($changes as $field => $vals)
        <li><strong>{{ ucfirst($field) }}:</strong> @if(isset($vals['from'])){{ $vals['from'] }}@else—@endif &rarr; {{ $vals['to'] ?? '—' }}</li>
      @endforeach
    </ul>
  @else
    <p>No visible profile fields were changed.</p>
  @endif

  <p>If you did not make or request these changes, please contact a Super Admin immediately.</p>

  <p style="margin-top:1.25rem; color:#555; font-size:0.95rem;">Thanks,<br/>The RentTrustGH Team</p>
</body>
</html>
