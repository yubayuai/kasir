<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Voucher;
use App\Services\DeltaSuryaApiService;
use App\Services\PricingService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = Transaction::with(['user', 'voucher'])
            ->when($request->search, function ($query, $search) {
                $query->where('transaction_number', 'like', "%{$search}%")
                      ->orWhere('patient_name', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(DeltaSuryaApiService $apiService)
    {
        $vouchers = Voucher::where('is_active', true)->get();
        $insurances = $apiService->getInsurances();
        $procedures = $apiService->getProcedures();

        return Inertia::render('Transactions/Create', [
            'vouchers' => $vouchers,
            'insurances' => $insurances,
            'procedures' => $procedures,
        ]);
    }

    public function store(Request $request, PricingService $pricingService)
    {
        $validated = $request->validate([
            'patient_name' => 'required|string|max:255',
            'patient_id' => 'nullable|string|max:255',
            'insurance_id' => 'nullable|string',
            'insurance_name' => 'nullable|string',
            'voucher_id' => 'nullable|exists:vouchers,id',
            'items' => 'required|array|min:1',
            'items.*.procedure_id' => 'required|string',
            'items.*.procedure_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $transaction = Transaction::create([
            'transaction_number' => 'TRX-' . now()->format('Ymd') . '-' . strtoupper(Str::random(4)),
            'user_id' => $request->user()->id,
            'patient_name' => $validated['patient_name'],
            'patient_id' => $validated['patient_id'],
            'insurance_id' => $validated['insurance_id'],
            'insurance_name' => $validated['insurance_name'],
            'voucher_id' => $validated['voucher_id'] ?? null,
            'status' => 'pending',
        ]);

        $this->processTransactionItems($transaction, $validated['items'], $pricingService);

        return redirect()->route('transactions.show', $transaction)->with('success', 'Transaksi berhasil dibuat.');
    }

    public function show(Transaction $transaction)
    {
        $transaction->load(['items', 'user', 'voucher']);
        return Inertia::render('Transactions/Show', ['transaction' => $transaction]);
    }

    public function edit(Transaction $transaction, DeltaSuryaApiService $apiService)
    {
        if ($transaction->status !== 'pending') {
            return redirect()->route('transactions.show', $transaction)->with('error', 'Tidak dapat mengedit transaksi yang sudah dibayar.');
        }

        $transaction->load(['items', 'voucher']);
        $vouchers = Voucher::where('is_active', true)->get();
        $insurances = $apiService->getInsurances();
        $procedures = $apiService->getProcedures();

        return Inertia::render('Transactions/Edit', [
            'transaction' => $transaction,
            'vouchers' => $vouchers,
            'insurances' => $insurances,
            'procedures' => $procedures,
        ]);
    }

    public function update(Request $request, Transaction $transaction, PricingService $pricingService)
    {
        if ($transaction->status !== 'pending') {
            return redirect()->back()->with('error', 'Tidak dapat memperbarui transaksi yang sudah dibayar.');
        }

        $validated = $request->validate([
            'patient_name' => 'required|string|max:255',
            'patient_id' => 'nullable|string|max:255',
            'insurance_id' => 'nullable|string',
            'insurance_name' => 'nullable|string',
            'voucher_id' => 'nullable|exists:vouchers,id',
            'items' => 'required|array|min:1',
            'items.*.procedure_id' => 'required|string',
            'items.*.procedure_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $transaction->update([
            'patient_name' => $validated['patient_name'],
            'patient_id' => $validated['patient_id'],
            'insurance_id' => $validated['insurance_id'],
            'insurance_name' => $validated['insurance_name'],
            'voucher_id' => $validated['voucher_id'] ?? null,
        ]);

        // Refresh items
        $transaction->items()->delete();
        $this->processTransactionItems($transaction, $validated['items'], $pricingService);

        return redirect()->route('transactions.show', $transaction)->with('success', 'Transaksi berhasil diperbarui.');
    }

    /**
     * Process items, calculate prices, and update transaction totals
     */
    private function processTransactionItems(Transaction $transaction, array $itemsData, PricingService $pricingService): void
    {
        $voucher = $transaction->voucher_id ? Voucher::find($transaction->voucher_id) : null;
        $subtotal = 0;
        $totalDiscount = 0;

        foreach ($itemsData as $item) {
            $price = $pricingService->getProcedurePriceForInsurance($item['procedure_id'], $transaction->insurance_id);
            $itemDiscount = $pricingService->calculateItemDiscount($price, $voucher, $transaction->insurance_id);
            
            $itemSubtotal = ($price - $itemDiscount) * $item['quantity'];

            TransactionItem::create([
                'transaction_id' => $transaction->id,
                'procedure_id' => $item['procedure_id'],
                'procedure_name' => $item['procedure_name'],
                'price' => $price,
                'discount_amount' => $itemDiscount,
                'subtotal' => $itemSubtotal,
                'quantity' => $item['quantity'],
            ]);

            $subtotal += ($price * $item['quantity']);
            $totalDiscount += ($itemDiscount * $item['quantity']);
        }

        $transaction->update([
            'subtotal' => $subtotal,
            'discount_amount' => $totalDiscount,
            'total' => $subtotal - $totalDiscount,
        ]);
    }

    public function destroy(Transaction $transaction)
    {
        // Removed status check to allow deleting paid transactions as requested

        $transaction->delete();
        return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids', []);
        if (empty($ids)) {
            return redirect()->back()->with('error', 'Tidak ada transaksi yang dipilih.');
        }

        Transaction::whereIn('id', $ids)->delete();
        return redirect()->route('transactions.index')->with('success', 'Transaksi yang dipilih berhasil dihapus.');
    }

    public function pay(Transaction $transaction)
    {
        if ($transaction->status !== 'pending') {
            return redirect()->back()->with('error', 'Transaksi ini sudah dibayar.');
        }

        $transaction->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Pembayaran berhasil.');
    }

    public function printReceipt(Transaction $transaction)
    {
        $transaction->load(['items', 'user', 'voucher']);
        
        $pdf = Pdf::loadView('pdf.receipt', compact('transaction'));
        return $pdf->download("Receipt-{$transaction->transaction_number}.pdf");
    }

    public function preview(Request $request, PricingService $pricingService)
    {
        $validated = $request->validate([
            'insurance_id' => 'nullable|string',
            'voucher_id' => 'nullable|exists:vouchers,id',
            'items' => 'required|array',
            'items.*.procedure_id' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $voucher = null;
        if (!empty($validated['voucher_id'])) {
            $voucher = Voucher::find($validated['voucher_id']);
        }

        $items = [];
        $subtotal = 0;
        $totalDiscount = 0;

        foreach ($validated['items'] as $item) {
            $price = $pricingService->getProcedurePriceForInsurance($item['procedure_id'], $validated['insurance_id']);
            $itemDiscount = $pricingService->calculateItemDiscount($price, $voucher, $validated['insurance_id']);
            
            $subtotalPerItem = $price * $item['quantity'];
            $discountPerItem = $itemDiscount * $item['quantity'];
            $totalPerItem = $subtotalPerItem - $discountPerItem;

            $items[] = [
                'procedure_id' => $item['procedure_id'],
                'price' => $price,
                'discount_amount' => $itemDiscount,
                'subtotal' => $totalPerItem,
                'quantity' => $item['quantity'],
            ];

            $subtotal += $subtotalPerItem;
            $totalDiscount += $discountPerItem;
        }

        return response()->json([
            'items' => $items,
            'subtotal' => $subtotal,
            'total_discount' => $totalDiscount,
            'total' => $subtotal - $totalDiscount,
        ]);
    }

    public function exportPdf(Request $request)
    {
        $transactions = Transaction::with(['user'])
            ->when($request->search, function($q, $search) {
                $q->where('transaction_number', 'like', "%{$search}%")
                  ->orWhere('patient_name', 'like', "%{$search}%");
            })
            ->when($request->status, function($q, $status) {
                $q->where('status', $status);
            })
            ->latest()
            ->get();

        $pdf = Pdf::loadView('pdf.transactions', compact('transactions'));
        return $pdf->download("Transactions-Report-" . now()->format('Y-m-d') . ".pdf");
    }
}
