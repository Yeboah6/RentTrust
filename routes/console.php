<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\{Schedule};
use App\Console\Commands\ExpireSubscriptions;
use App\Console\Commands\NotifyExpiringSubscriptions;

// Existing scheduled commands
Schedule::command(ExpireSubscriptions::class)->dailyAt('01:00');
Schedule::command('sitemap:generate')->daily();

Schedule::command(NotifyExpiringSubscriptions::class)->dailyAt('08:00');

// Display inspiring quote
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
