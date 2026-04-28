<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Receipt - {{ $transaction->transaction_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
            line-height: 1.5;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #10b981; /* Primary color */
        }
        .info-table {
            width: 100%;
            margin-bottom: 20px;
        }
        .info-table td {
            padding: 5px 0;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .items-table th, .items-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .items-table th {
            background-color: #f9fafb;
        }
        .text-right {
            text-align: right !important;
        }
        .text-center {
            text-align: center !important;
        }
        .summary-box {
            float: right;
            width: 300px;
        }
        .summary-table {
            width: 100%;
        }
        .summary-table td {
            padding: 5px 0;
        }
        .total-row td {
            font-size: 16px;
            font-weight: bold;
            border-top: 1px solid #333;
            padding-top: 10px;
            color: #10b981;
        }
        .footer {
            clear: both;
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>RS DELTA SURYA</h1>
        <p>Jl. Pahlawan No.9, Sidoarjo<br>Telp: (031) 8962531</p>
    </div>

    <table class="info-table">
        <tr>
            <td width="20%"><strong>Transaction No:</strong></td>
            <td width="30%">{{ $transaction->transaction_number }}</td>
            <td width="20%"><strong>Date:</strong></td>
            <td width="30%">{{ $transaction->paid_at ? $transaction->paid_at->format('d M Y H:i') : $transaction->created_at->format('d M Y H:i') }}</td>
        </tr>
        <tr>
            <td><strong>Patient Name:</strong></td>
            <td>{{ $transaction->patient_name }}</td>
            <td><strong>Status:</strong></td>
            <td>{{ strtoupper($transaction->status) }}</td>
        </tr>
        <tr>
            <td><strong>Insurance:</strong></td>
            <td>{{ $transaction->insurance_name ?: 'UMUM' }}</td>
            <td><strong>Cashier:</strong></td>
            <td>{{ $transaction->user->name }}</td>
        </tr>
    </table>

    <table class="items-table">
        <thead>
            <tr>
                <th>No</th>
                <th>Procedure</th>
                <th class="text-right">Price (Rp)</th>
                <th class="text-center">Qty</th>
                <th class="text-right">Discount (Rp)</th>
                <th class="text-right">Subtotal (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transaction->items as $index => $item)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $item->procedure_name }}</td>
                <td class="text-right">{{ number_format($item->price, 0, ',', '.') }}</td>
                <td class="text-center">{{ $item->quantity }}</td>
                <td class="text-right">{{ $item->discount_amount > 0 ? number_format($item->discount_amount * $item->quantity, 0, ',', '.') : '-' }}</td>
                <td class="text-right">{{ number_format($item->subtotal, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="summary-box">
        <table class="summary-table">
            <tr>
                <td>Subtotal:</td>
                <td class="text-right">Rp {{ number_format($transaction->subtotal, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>Total Discount:</td>
                <td class="text-right">- Rp {{ number_format($transaction->discount_amount, 0, ',', '.') }}</td>
            </tr>
            <tr class="total-row">
                <td>Total:</td>
                <td class="text-right">Rp {{ number_format($transaction->total, 0, ',', '.') }}</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <p>Thank you for choosing RS Delta Surya for your healthcare needs.</p>
        <p>Semoga lekas sembuh.</p>
    </div>

</body>
</html>
