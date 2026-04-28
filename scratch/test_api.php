<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$service = app(App\Services\DeltaSuryaApiService::class);
$procedures = $service->getProcedures();
echo "Procedures found: " . count($procedures) . "\n";
print_r($procedures[0] ?? "None");
