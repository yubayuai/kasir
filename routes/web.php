<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\VoucherController;
use App\Http\Controllers\Api\InsuranceController;
use App\Http\Controllers\Api\ProcedureController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // API Routes for internal use (proxy to external API)
    Route::get('/api/insurances', [InsuranceController::class, 'index'])->name('api.insurances');
    Route::get('/api/procedures', [ProcedureController::class, 'index'])->name('api.procedures');
    Route::post('/api/procedures/price', [ProcedureController::class, 'calculatePrice'])->name('api.procedures.price');
    Route::post('/api/transactions/preview', [TransactionController::class, 'preview'])->name('api.transactions.preview');

    // Marketing Routes
    Route::middleware('role:marketing')->group(function () {
        Route::resource('vouchers', VoucherController::class);
    });

    // Kasir Routes
    Route::middleware('role:kasir')->group(function () {
        Route::delete('/transactions/bulk-destroy', [TransactionController::class, 'bulkDestroy'])->name('transactions.bulk-destroy');
        Route::get('/transactions/export-pdf', [TransactionController::class, 'exportPdf'])->name('transactions.export-pdf');
        Route::resource('transactions', TransactionController::class);
        Route::post('/transactions/{transaction}/pay', [TransactionController::class, 'pay'])->name('transactions.pay');
        Route::get('/transactions/{transaction}/receipt', [TransactionController::class, 'printReceipt'])->name('transactions.receipt');
    });
});

require __DIR__.'/auth.php';
