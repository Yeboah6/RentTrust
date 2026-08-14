<?php

namespace App\Jobs;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendSubscriptionExpiryReminder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Subscription $subscription,
        public int $daysLeft
    ) {}

    public function handle(): void
    {
        $user = $this->subscription->user;
        $planName = ucfirst($this->subscription->plan->name);

        Mail::raw(
            "Hi {$user->name},\n\n" .
            "Your RentTrustGh {$planName} subscription ends in {$this->daysLeft} day(s), on " .
            "{$this->subscription->ends_at->format('jS M, Y')}.\n\n" .
            "Renew now to keep your listings active and avoid losing your {$planName} benefits.\n\n" .
            "— RentTrustGh Team",
            function ($message) use ($user, $planName) {
                $message->to($user->email)
                    ->subject("Your {$planName} subscription ends in {$this->daysLeft} day(s)");
            }
        );
    }
}
