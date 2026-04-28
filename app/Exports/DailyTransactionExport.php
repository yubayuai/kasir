<?php

namespace App\Exports;

use App\Models\Transaction;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class DailyTransactionExport implements FromCollection, WithHeadings, WithMapping
{
    protected $transactions;

    public function __construct($transactions)
    {
        $this->transactions = $transactions;
    }

    public function collection()
    {
        return $this->transactions;
    }

    public function headings(): array
    {
        return [
            'No. Transaksi',
            'Waktu Bayar',
            'Kasir',
            'Nama Pasien',
            'ID Pasien',
            'Asuransi',
            'Voucher',
            'Subtotal',
            'Diskon',
            'Total',
        ];
    }

    public function map($transaction): array
    {
        return [
            $transaction->transaction_number,
            $transaction->paid_at ? $transaction->paid_at->format('d/m/Y H:i') : '-',
            $transaction->user->name ?? '',
            $transaction->patient_name,
            $transaction->patient_id ?? '-',
            $transaction->insurance_name ?? 'Umum',
            $transaction->voucher->name ?? '-',
            $transaction->subtotal,
            $transaction->discount_amount,
            $transaction->total,
        ];
    }
}
