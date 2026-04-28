<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoucherController extends Controller
{
    public function index(Request $request)
    {
        $vouchers = Voucher::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('insurance_name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Vouchers/Index', [
            'vouchers' => $vouchers,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Vouchers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'insurance_id' => 'required|string',
            'insurance_name' => 'required|string',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
            'is_active' => 'boolean',
        ]);

        Voucher::create($validated);

        return redirect()->route('vouchers.index')->with('success', 'Voucher berhasil dibuat.');
    }

    public function edit(Voucher $voucher)
    {
        return Inertia::render('Vouchers/Edit', ['voucher' => $voucher]);
    }

    public function update(Request $request, Voucher $voucher)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'insurance_id' => 'required|string',
            'insurance_name' => 'required|string',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
            'is_active' => 'boolean',
        ]);

        $voucher->update($validated);

        return redirect()->route('vouchers.index')->with('success', 'Voucher berhasil diperbarui.');
    }

    public function destroy(Voucher $voucher)
    {
        $voucher->delete();
        return redirect()->route('vouchers.index')->with('success', 'Voucher berhasil dihapus.');
    }
}
