{{-- <x-mail::message>
# Introduction

The body of your message.

<x-mail::button :url="''">
Button Text
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message> --}}

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 24px; }
        .header { background: #1a1a2e; color: #fff; padding: 20px 24px; border-radius: 6px 6px 0 0; }
        .body { background: #f9f9f9; padding: 24px; border: 1px solid #e0e0e0; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 13px; font-weight: bold; }
        .status-approved { background: #d4edda; color: #155724; }
        .status-pending  { background: #fff3cd; color: #856404; }
        .status-rejected { background: #f8d7da; color: #721c24; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        td { padding: 8px 12px; border-bottom: 1px solid #e0e0e0; font-size: 14px; }
        td:first-child { font-weight: bold; width: 38%; color: #555; }
        .footer { font-size: 12px; color: #999; margin-top: 24px; text-align: center; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h2 style="margin:0;">Listing Updated</h2>
    </div>
    <div class="body">
        <p>Hello <strong>{{ $listing->agent_name ?? 'Agent' }}</strong>,</p>
        <p>Your listing has been reviewed and updated by an administrator. Here is a summary of the current details:</p>

        <table>
            <tr><td>Title</td><td>{{ $listing->title }}</td></tr>
            <tr><td>Property Type</td><td>{{ $listing->property_type ?? '—' }}</td></tr>
            <tr><td>Location</td><td>{{ $listing->area }}, {{ $listing->city }}</td></tr>
            <tr><td>Purpose</td><td>{{ ucfirst($listing->purpose) }}</td></tr>
            <tr>
                <td>Price</td>
                <td>
                    @if($listing->purpose === 'sale')
                        GHS {{ number_format($listing->sale_price, 2) }}
                    @else
                        GHS {{ number_format($listing->rent_min, 2) }} – {{ number_format($listing->rent_max, 2) }} / mo
                    @endif
                </td>
            </tr>
            <tr>
                <td>Status</td>
                <td>
                    <span class="badge status-{{ $listing->status }}">
                        {{ ucfirst($listing->status) }}
                    </span>
                </td>
            </tr>
            <tr><td>Featured</td><td>{{ $listing->is_featured ? 'Yes' : 'No' }}</td></tr>
            <tr><td>Verified</td><td>{{ $listing->is_verified ? 'Yes' : 'No' }}</td></tr>
        </table>

        <p style="margin-top: 20px;">If you have any questions about these changes, please contact our support team.</p>
    </div>
    <div class="footer">
        &copy; {{ date('Y') }} {{ config('app.name') }} &mdash; This is an automated notification.
    </div>
</div>
</body>
</html>
