#!/usr/bin/env php
<?php

require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';

use Illuminate\Support\Facades\Artisan;

try {
    // Force the database connection
    config(['database.default' => 'sqlite']);
    
    echo "Current DB Connection: " . config('database.default') . "\n";
    echo "DB Database: " . config('database.connections.sqlite.database') . "\n";
    
    // Run migrations
    echo "\nRunning migrations...\n";
    Artisan::call('migrate', ['--force' => true]);
    echo Artisan::output();
    
    echo "\n\nDone!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}
