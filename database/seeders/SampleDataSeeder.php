<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        $kasir = User::where('role', 'kasir')->first();
        if (!$kasir) return;

        $vouchers = Voucher::all();
        $insurances = [
            ['id' => 'ins-1', 'name' => 'BPJS Kesehatan'],
            ['id' => 'ins-2', 'name' => 'Prudential'],
            ['id' => 'ins-3', 'name' => 'Allianz'],
            ['id' => 'ins-4', 'name' => 'Manulife'],
            ['id' => null, 'name' => 'Umum'],
        ];

        $procedures = [
            ['id' => 'proc-1', 'name' => 'Konsultasi Dokter Umum', 'price' => 100000],
            ['id' => 'proc-2', 'name' => 'Konsultasi Dokter Spesialis', 'price' => 250000],
            ['id' => 'proc-3', 'name' => 'Cek Darah Lengkap', 'price' => 150000],
            ['id' => 'proc-4', 'name' => 'Rontgen Thorax', 'price' => 300000],
            ['id' => 'proc-5', 'name' => 'EKG', 'price' => 200000],
        ];

        $patients = [
            'Budi Santoso', 'Siti Aminah', 'Agus Prayogo', 'Dewi Lestari', 
            'Eko Prasetyo', 'Lani Wijaya', 'Rudi Hermawan', 'Indah Permata',
            'Andi Wijaya', 'Maya Sari', 'Doni Kusuma', 'Rina Wati'
        ];

        // Generate transactions for the last 10 days
        for ($i = 10; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $numTransactions = rand(3, 8);

            for ($j = 0; $j < $numTransactions; $j++) {
                $insurance = $insurances[array_rand($insurances)];
                $patientName = $patients[array_rand($patients)];
                
                // Randomly pick a voucher if insurance matches
                $applicableVoucher = null;
                if ($insurance['id']) {
                    $applicableVoucher = $vouchers->where('insurance_name', $insurance['name'])->first();
                }

                $status = ($i === 0 && rand(0, 1)) ? 'pending' : 'paid';

                $transaction = Transaction::create([
                    'transaction_number' => 'TRX-' . $date->format('Ymd') . '-' . strtoupper(Str::random(4)),
                    'user_id' => $kasir->id,
                    'patient_name' => $patientName,
                    'patient_id' => 'P-' . rand(1000, 9999),
                    'insurance_id' => $insurance['id'],
                    'insurance_name' => $insurance['name'],
                    'voucher_id' => $applicableVoucher?->id,
                    'status' => $status,
                    'paid_at' => $status === 'paid' ? $date->addMinutes(rand(5, 60)) : null,
                    'created_at' => $date,
                    'updated_at' => $date,
                ]);

                // Add 1-3 items
                $subtotal = 0;
                $totalDiscount = 0;
                $numItems = rand(1, 3);
                $selectedProcs = array_rand($procedures, $numItems);
                if (!is_array($selectedProcs)) $selectedProcs = [$selectedProcs];

                foreach ($selectedProcs as $procIdx) {
                    $proc = $procedures[$procIdx];
                    $qty = rand(1, 2);
                    
                    $price = $proc['price'];
                    // Apply insurance specific price mock
                    if ($insurance['id'] === 'ins-1') $price *= 0.8; // BPJS
                    
                    $discount = 0;
                    if ($applicableVoucher) {
                        if ($applicableVoucher->discount_type === 'percentage') {
                            $discount = $price * ($applicableVoucher->discount_value / 100);
                            if ($applicableVoucher->max_discount && $discount > $applicableVoucher->max_discount) {
                                $discount = $applicableVoucher->max_discount;
                            }
                        } else {
                            $discount = min($price, $applicableVoucher->discount_value);
                        }
                    }

                    TransactionItem::create([
                        'transaction_id' => $transaction->id,
                        'procedure_id' => $proc['id'],
                        'procedure_name' => $proc['name'],
                        'price' => $price,
                        'discount_amount' => $discount,
                        'subtotal' => ($price - $discount) * $qty,
                        'quantity' => $qty,
                        'created_at' => $date,
                        'updated_at' => $date,
                    ]);

                    $subtotal += ($price * $qty);
                    $totalDiscount += ($discount * $qty);
                }

                $transaction->update([
                    'subtotal' => $subtotal,
                    'discount_amount' => $totalDiscount,
                    'total' => $subtotal - $totalDiscount,
                ]);
            }
        }
    }
}
