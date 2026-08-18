<?php

namespace Tests\Feature;

use App\Mail\AdminInvitation;
use App\Mail\AdminUpdated;
use App\Mail\AgentAccountUpdated;
use App\Mail\AgentInvitation;
use App\Mail\AgentReactivated;
use App\Mail\AgentRegistration;
use App\Mail\AgentSuspended;
use App\Mail\ListingUpdatedMail;
use App\Mail\NewListingMail;
use App\Mail\ResetPasswordMail;
use App\Mail\SubscriptionExpiringMail;
use App\Models\Rental;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class MailTest extends TestCase
{
    /**
     * Test AdminInvitation Mail
     * ❌ CURRENTLY BROKEN - Missing with() data
     */
    public function test_admin_invitation_mail()
    {
        Mail::fake();

        $mail = new AdminInvitation(
            adminName: 'John Doe',
            adminEmail: 'yeboahs324@gmail.com',
            setupUrl: 'https://example.com/setup/token',
            expiresAt: '2026-08-25',
            temporaryPassword: 'TempPass123',
            loginUrl: 'https://example.com/login',
            isPasswordReset: false
        );

        $mailable = $mail->render();

        $this->assertNotEmpty($mailable);
        $this->assertStringContainsString('john@example.com', $mailable);
        
        Mail::send($mail);
        Mail::assertSent(AdminInvitation::class);
    }

    /**
     * Test AgentInvitation Mail
     * ❌ CURRENTLY BROKEN - Missing with() data
     */
    public function test_agent_invitation_mail()
    {
        Mail::fake();

        $mail = new AgentInvitation(
            agentName: 'Jane Smith',
            agentEmail: 'yeboahs324@gmail.com',
            setupUrl: 'https://example.com/agent-setup/token',
            expiresAt: '2026-08-25'
        );

        $mailable = $mail->render();

        $this->assertNotEmpty($mailable);
        Mail::send($mail);
        Mail::assertSent(AgentInvitation::class);
    }

    /**
     * Test AdminUpdated Mail
     * ✅ WORKING
     */
    public function test_admin_updated_mail()
    {
        Mail::fake();

        $mail = new AdminUpdated(
            adminName: 'Admin User',
            adminEmail: 'yeboahs324@gmail.com',
            updatedBy: 'Super Admin',
            changes: [
                'name' => ['old' => 'Old Name', 'new' => 'New Name'],
                'email' => ['old' => 'old@example.com', 'new' => 'new@example.com'],
            ]
        );

        $mailable = $mail->render();

        $this->assertNotEmpty($mailable);
        $this->assertStringContainsString('Admin User', $mailable);
        $this->assertStringContainsString('Super Admin', $mailable);
        
        Mail::send($mail);
        Mail::assertSent(AdminUpdated::class);
    }

    /**
     * Test AgentAccountUpdated Mail
     * ⚠️ RISKY - Model serialization
     */
    public function test_agent_account_updated_mail()
    {
        Mail::fake();

        $agent = User::factory()->create(['name' => 'Agent One', 'email' => 'yeboahs324@gmail.com']);
        $updatedBy = User::factory()->create(['name' => 'Admin', 'email' => 'yeboahs324@gmail.com']);

        $mail = new AgentAccountUpdated(
            agent: $agent,
            changedFields: ['name', 'phone'],
            updatedBy: $updatedBy
        );

        $mailable = $mail->render();

        $this->assertNotEmpty($mailable);
        $this->assertStringContainsString('Agent One', $mailable);
        
        Mail::send($mail);
        Mail::assertSent(AgentAccountUpdated::class);

        $agent->delete();
        $updatedBy->delete();
    }

    /**
     * Test AgentSuspended Mail
     * ⚠️ RISKY - Model serialization
     */
    public function test_agent_suspended_mail()
    {
        Mail::fake();

        $agent = User::factory()->create(['name' => 'Agent Suspended']);
        $suspendedBy = User::factory()->create(['name' => 'Admin Suspension']);

        $mail = new AgentSuspended(
            agent: $agent,
            suspendedBy: $suspendedBy,
            status: 'suspended',
            reason: 'Violating terms of service'
        );

        $mailable = $mail->render();

        $this->assertNotEmpty($mailable);
        $this->assertStringContainsString('suspended', strtolower($mailable));
        
        Mail::send($mail);
        Mail::assertSent(AgentSuspended::class);

        $agent->delete();
        $suspendedBy->delete();
    }

    /**
     * Test AgentReactivated Mail
     * ⚠️ RISKY - Model serialization
     */
    public function test_agent_reactivated_mail()
    {
        Mail::fake();

        $agent = User::factory()->create(['name' => 'Reactivated Agent']);
        $reactivatedBy = User::factory()->create(['name' => 'Admin Reactivation']);

        $mail = new AgentReactivated(
            agent: $agent,
            reactivatedBy: $reactivatedBy
        );

        $mailable = $mail->render();

        $this->assertNotEmpty($mailable);
        $this->assertStringContainsString('Reactivated', $mailable);
        
        Mail::send($mail);
        Mail::assertSent(AgentReactivated::class);

        $agent->delete();
        $reactivatedBy->delete();
    }

    /**
     * Test AgentRegistration Mail
     * ✅ WORKING
     */
    public function test_agent_registration_mail()
    {
        Mail::fake();

        $mail = new AgentRegistration(
            agentName: 'New Agent',
            agentEmail: 'yeboahs324@gmail.com',
            agentType: 'Individual',
            dashboardUrl: 'https://example.com/agent/dashboard'
        );

        $mailable = $mail->render();

        $this->assertNotEmpty($mailable);
        $this->assertStringContainsString('New Agent', $mailable);
        $this->assertStringContainsString('yeboahs324@gmail.com', $mailable);
        
        Mail::send($mail);
        Mail::assertSent(AgentRegistration::class);
    }

    /**
     * Test ResetPasswordMail
     * ❌ CURRENTLY BROKEN - Missing token in view
     */
    public function test_reset_password_mail()
    {
        Mail::fake();

        $user = User::factory()->create(['name' => 'Test User']);

        $mail = new ResetPasswordMail(
            user: $user,
            resetUrl: 'https://example.com/reset-password/token123',
            token: 'token123'
        );

        $mailable = $mail->render();

        $this->assertNotEmpty($mailable);
        $this->assertStringContainsString('Reset', $mailable);
        
        Mail::send($mail);
        Mail::assertSent(ResetPasswordMail::class);

        $user->delete();
    }

    /**
     * Test ListingUpdatedMail
     * ❌ CURRENTLY BROKEN - No view data passed
     */
    public function test_listing_updated_mail()
    {
        Mail::fake();

        $rental = Rental::factory()->create([
            'title' => 'Beautiful Apartment',
            'description' => 'A nice apartment'
        ]);

        $mail = new ListingUpdatedMail($rental);

        $mailable = $mail->render();

        $this->assertNotEmpty($mailable);
        
        Mail::send($mail);
        Mail::assertSent(ListingUpdatedMail::class);

        $rental->delete();
    }

    /**
     * Test NewListingMail
     * ❌ CURRENTLY BROKEN - Missing SerializesModels, old syntax
     */
    public function test_new_listing_mail()
    {
        Mail::fake();

        $rental = Rental::factory()->create([
            'title' => 'New Property Listing',
            'description' => 'Amazing new property'
        ]);

        $mail = new NewListingMail(
            rental: $rental,
            body: 'Check out this amazing new property listing!'
        );

        $mailable = $mail->render();

        $this->assertNotEmpty($mailable);
        $this->assertStringContainsString('New Property Listing', $mailable);
        
        Mail::send($mail);
        Mail::assertSent(NewListingMail::class);

        $rental->delete();
    }

    /**
     * Test SubscriptionExpiringMail
     * ⚠️ OUTDATED - Old syntax, model serialization
     */
    public function test_subscription_expiring_mail()
    {
        Mail::fake();

        $user = User::factory()->create(['name' => 'Subscriber']);
        $subscription = Subscription::factory()->create([
            'user_id' => $user->id,
            'ends_at' => now()->addDays(7)
        ]);

        $mail = new SubscriptionExpiringMail(
            subscription: $subscription,
            daysLeft: 7
        );

        $mailable = $mail->render();

        $this->assertNotEmpty($mailable);
        
        Mail::send($mail);
        Mail::assertSent(SubscriptionExpiringMail::class);

        $subscription->delete();
        $user->delete();
    }

    /**
     * Test all mail subjects are set
     */
    public function test_all_mail_subjects_are_set()
    {
        $mails = [
            new AdminInvitation('Admin', 'yeboahs324@gmail.com'),
            new AgentInvitation('Agent', 'yeboahs324@gmail.com', 'http://setup', '2026-08-25'),
            new AdminUpdated('Admin', 'yeboahs324@gmail.com', 'Super Admin'),
            new AgentRegistration('Agent', 'yeboahs324@gmail.com', 'Individual', 'http://dashboard'),
        ];

        foreach ($mails as $mail) {
            $envelope = $mail->envelope();
            $this->assertNotNull($envelope->subject);
            $this->assertNotEmpty($envelope->subject);
        }
    }

    /**
     * Test mail can be sent via queue
     */
    public function test_mails_implement_should_queue()
    {
        $queuedMails = [
            SubscriptionExpiringMail::class,
            ResetPasswordMail::class,
            ListingUpdatedMail::class,
            NewListingMail::class,
        ];

        foreach ($queuedMails as $mailClass) {
            $interfaces = class_implements($mailClass);
            $this->assertArrayHasKey(
                'Illuminate\Contracts\Queue\ShouldQueue',
                $interfaces,
                "{$mailClass} should implement ShouldQueue"
            );
        }
    }
}