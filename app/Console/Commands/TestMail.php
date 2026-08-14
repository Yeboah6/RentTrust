<?php

namespace App\Console\Commands;

use App\Mail\AdminInvitation;
use App\Mail\AgentRegistration;
use App\Mail\ResetPasswordMail;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestMail extends Command
{
    protected $signature = 'test:mail {--type=admin} {--email=test@example.com}';
    protected $description = 'Test sending mail without frontend';

    public function handle()
    {
        $type = $this->option('type');
        $email = $this->option('email');

        try {
            match($type) {
                'admin' => Mail::to($email)->send(new AdminInvitation(
                    adminName: 'Test Admin',
                    adminEmail: $email,
                    setupUrl: 'https://example.com/setup',
                    temporaryPassword: 'Temp123'
                )),
                'agent' => Mail::to($email)->send(new AgentRegistration(
                    agentName: 'Test Agent',
                    agentEmail: $email,
                    agentType: 'Premium',
                    dashboardUrl: 'https://example.com/dashboard'
                )),
                'reset' => Mail::to($email)->send(new ResetPasswordMail(
                    User::first(),
                    'https://example.com/reset/token123',
                    'token123'
                )),
                default => $this->error("Unknown mail type: $type")
            };

            $this->info("✅ Email sent to $email");
        } catch (\Exception $e) {
            $this->error("❌ Failed: " . $e->getMessage());
        }
    }
}