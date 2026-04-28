<?php

namespace Database\Seeders;

use App\Models\Voucher;
use Illuminate\Database\Seeder;

class VoucherSeeder extends Seeder
{
    public function run(): void
    {
        $vouchers = [
            [
                'name' => 'Promo Ramadhan BPJS',
                'code' => 'RAMADHAN-BPJS',
                'discount_type' => 'percentage',
                'discount_value' => 10,
                'max_discount' => 50000,
                'insurance_id' => 'ins-1',
                'insurance_name' => 'BPJS Kesehatan',
                'valid_from' => now()->startOfMonth(),
                'valid_until' => now()->addMonths(2),
                'is_active' => true,
            ],
            [
                'name' => 'Cashback Prudential 20rb',
                'code' => 'PRUDENTIAL-20K',
                'discount_type' => 'fixed',
                'discount_value' => 20000,
                'insurance_id' => 'ins-2',
                'insurance_name' => 'Prudential',
                'valid_from' => now()->startOfMonth(),
                'valid_until' => now()->addYear(),
                'is_active' => true,
            ],
            [
                'name' => 'Diskon Allianz Spesialis',
                'code' => 'ALLIANZ-SPEC',
                'discount_type' => 'percentage',
                'discount_value' => 15,
                'max_discount' => 100000,
                'insurance_id' => 'ins-3',
                'insurance_name' => 'Allianz',
                'valid_from' => now()->subMonth(),
                'valid_until' => now()->addMonth(),
                'is_active' => true,
            ],
            [
                'name' => 'Voucher Manulife Family',
                'code' => 'MANULIFE-FAM',
                'discount_type' => 'fixed',
                'discount_value' => 50000,
                'insurance_id' => 'ins-4',
                'insurance_name' => 'Manulife',
                'valid_from' => now()->startOfMonth(),
                'valid_until' => now()->addMonths(6),
                'is_active' => true,
            ],
        ];

        foreach ($vouchers as $voucher) {
            Voucher::create($voucher);
        }
    }
}
