<!DOCTYPE html>
<html>
<head>
    <title>Laporan Transaksi</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header { text-align: center; margin-bottom: 30px; }
        .total { text-align: right; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>RS Delta Surya</h2>
        <h3>Laporan Daftar Transaksi</h3>
        <p>Dicetak pada: {{ now()->format('d M Y H:i') }} WIB</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>No. Transaksi</th>
                <th>Tanggal</th>
                <th>Pasien</th>
                <th>Asuransi</th>
                <th>Status</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $index => $trx)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $trx->transaction_number }}</td>
                <td>{{ $trx->created_at->format('d/m/Y') }}</td>
                <td>{{ $trx->patient_name }}</td>
                <td>{{ $trx->insurance_name ?? 'Umum' }}</td>
                <td>{{ $trx->status === 'paid' ? 'Lunas' : 'Belum Bayar' }}</td>
                <td style="text-align: right">Rp {{ number_format($trx->total, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total">
        Total Pendapatan: Rp {{ number_format($transactions->where('status', 'paid')->sum('total'), 0, ',', '.') }}
    </div>
</body>
</html>
