<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$db = $app->make('db');

// Check users table columns
$columns = $db->getSchemaBuilder()->getColumnListing('users');
echo "Users table columns:\n";
print_r($columns);

// Check if user_id exists
if (in_array('user_id', $columns)) {
    echo "\n✓ user_id column exists in users table\n";
} else {
    echo "\n✗ user_id column NOT found in users table\n";
}

// Check rentals table
$columns = $db->getSchemaBuilder()->getColumnListing('rentals');
echo "\nRentals table columns:\n";
print_r($columns);

if (in_array('rental_id', $columns)) {
    echo "\n✓ rental_id column exists in rentals table\n";
} else {
    echo "\n✗ rental_id column NOT found in rentals table\n";
}
