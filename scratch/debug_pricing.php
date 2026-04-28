<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Voucher;
use App\Services\PricingService;

$service = app(PricingService::class);

// Find all vouchers
$vouchers = Voucher::all();
echo "Vouchers found: " . $vouchers->count() . "\n";
foreach ($vouchers as $v) {
    echo "- ID: {$v->id}, Name: {$v->name}, Ins ID: {$v->insurance_id}, Ins Name: {$v->insurance_name}, Type: {$v->discount_type}, Value: {$v->discount_value}\n";
}

// Test Allianz
$allianzVoucher = Voucher::where('name', 'like', '%Allianz%')->first();
if ($allianzVoucher) {
    echo "\nTesting Allianz Voucher: {$allianzVoucher->name}\n";
    $price = 150000;
    $insuranceId = 'ins-3'; // Mock ID for Allianz
    $discount = $service->calculateItemDiscount($price, $allianzVoucher, $insuranceId);
    echo "Price: {$price}, Ins ID: {$insuranceId}, Discount Result: {$discount}\n";
    
    $insuranceName = 'Asuransi Allianz';
    $discount2 = $service->calculateItemDiscount($price, $allianzVoucher, $insuranceName);
    echo "Price: {$price}, Ins Name: {$insuranceName}, Discount Result: {$discount2}\n";
} else {
    echo "\nAllianz Voucher NOT FOUND in DB\n";
}
