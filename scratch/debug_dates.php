<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Voucher;

$vouchers = Voucher::all();
/** @var \App\Models\Voucher $v */
foreach ($vouchers as $v) {
    echo "Name: {$v->name}\n";
    echo "- Valid From: " . ($v->valid_from ? $v->valid_from->format('Y-m-d') : 'NULL') . "\n";
    echo "- Valid Until: " . ($v->valid_until ? $v->valid_until->format('Y-m-d') : 'NULL') . "\n";
    echo "- Now: " . now()->format('Y-m-d') . "\n";
    $now = now()->startOfDay();
    $from = $v->valid_from ? $v->valid_from->startOfDay() : null;
    $until = $v->valid_until ? $v->valid_until->startOfDay() : null;
    
    echo "- Check From: " . ($from ? ($now->lt($from) ? 'Too Early' : 'OK') : 'N/A') . "\n";
    echo "- Check Until: " . ($until ? ($now->gt($until) ? 'Too Late' : 'OK') : 'N/A') . "\n";
}
