<?php

namespace Database\Seeders;

use App\Models\Voucher;
use Illuminate\Database\Seeder;

class BriefingVoucherSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Reliance: 5% max 35k
        Voucher::updateOrCreate(
            ['name' => 'Voucher Reliance Januari'],
            [
                'code' => 'RELIANCE-JAN-26',
                'insurance_id' => 'ins-mock-reliance', // Mock ID
                'insurance_name' => 'Asuransi Reliance',
                'discount_type' => 'percentage',
                'discount_value' => 5,
                'max_discount' => 35000,
                'valid_from' => '2026-01-01',
                'valid_until' => '2026-01-31',
                'is_active' => true,
            ]
        );

        // 2. Allianz: 1% no limit
        Voucher::updateOrCreate(
            ['name' => 'Promo Allianz Unlimited'],
            [
                'code' => 'ALLIANZ-FREE',
                'insurance_id' => 'ins-3', // Mock ID
                'insurance_name' => 'Asuransi Allianz',
                'discount_type' => 'percentage',
                'discount_value' => 1,
                'max_discount' => null,
                'valid_from' => '2026-01-01',
                'valid_until' => '2026-12-31',
                'is_active' => true,
            ]
        );

        // 3. Prudential: 15k flat
        Voucher::updateOrCreate(
            ['name' => 'Cashback Prudential'],
            [
                'code' => 'PRUDENTIAL-CASHBACK',
                'insurance_id' => 'ins-2', // Mock ID
                'insurance_name' => 'Asuransi Prudential',
                'discount_type' => 'fixed',
                'discount_value' => 15000,
                'max_discount' => null,
                'valid_from' => '2026-01-01',
                'valid_until' => '2026-12-31',
                'is_active' => true,
            ]
        );
    }
}
