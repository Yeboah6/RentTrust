<?php

require __DIR__ . '/vendor/autoload.php';

// Bootstrap the framework
$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Illuminate\Http\Request::create('/rent/listings', 'GET');

$response = $kernel->handle($request);

// output status code
echo "Status: " . $response->getStatusCode() . "\n";
echo "Content:\n" . $response->getContent() . "\n";

// terminate (optional)
$kernel->terminate($request, $response);
