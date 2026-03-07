<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    /**
     * Display the contact page.
     */
    public function show()
    {
        return inertia('ContactPage');
    }

    /**
     * Handle a form submission from the contact page.
     */
    public function send(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'phone'   => 'nullable|string|max:30',
            'subject' => 'nullable|string|max:100',
            'message' => 'required|string|max:5000',
        ]);
    
        $recipient = config('mail.from.address') ?: env('MAIL_FROM_ADDRESS');
    
        if ($recipient) {
            $subject = isset($data['subject']) && $data['subject']
                ? "[RentTrust Contact] {$data['subject']}"
                : '[RentTrust Contact] New Message';
    
            Mail::send([], [], function ($message) use ($data, $recipient, $subject) {
                $message->to($recipient)
                        ->replyTo($data['email'], $data['name'])
                        ->subject($subject)
                        ->setBody(
                            "Name:    {$data['name']}\n" .
                            "Email:   {$data['email']}\n" .
                            "Phone:   " . ($data['phone'] ?? 'Not provided') . "\n" .
                            "Subject: " . ($data['subject'] ?? 'General Enquiry') . "\n" .
                            str_repeat('-', 40) . "\n\n" .
                            $data['message'],
                            'text/plain'
                        );
            });
        }
    
        return response()->json(['message' => 'Thank you for reaching out! We\'ll get back to you within 24 hours.']);
    }
}
