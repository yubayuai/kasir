<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'marketing') {
            return $this->marketingDashboard();
        }

        return $this->kasirDashboard();
    }

    protected function marketingDashboard()
    {
        // Visits and Revenue by Insurance
        $topInsurances = Transaction::selectRaw('insurance_name, COUNT(*) as visits, SUM(total) as revenue')
            ->whereNotNull('insurance_name')
            ->groupBy('insurance_name')
            ->orderByDesc('visits')
            ->limit(5)
            ->get();

        // Revenue trend for the last 7 days
        $revenueTrend = Transaction::selectRaw('DATE(created_at) as date, SUM(total) as total')
            ->where('status', 'paid')
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => date('D', strtotime($item->date)),
                    'total' => (float) $item->total,
                ];
            });

        // Insurance distribution for Pie Chart
        $insuranceDistribution = Transaction::selectRaw('insurance_name, COUNT(*) as count')
            ->whereNotNull('insurance_name')
            ->groupBy('insurance_name')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->insurance_name,
                    'value' => $item->count,
                ];
            });

        $activeVouchers = Voucher::where('is_active', true)->count();
        $totalVouchers = Voucher::count();
        $totalRevenue = Transaction::where('status', 'paid')->sum('total');

        return Inertia::render('Dashboard/Marketing', [
            'topInsurances' => $topInsurances,
            'activeVouchers' => $activeVouchers,
            'totalVouchers' => $totalVouchers,
            'totalRevenue' => $totalRevenue,
            'revenueTrend' => $revenueTrend,
            'insuranceDistribution' => $insuranceDistribution,
            'recentTransactions' => Transaction::with('voucher')->latest()->limit(5)->get(),
        ]);
    }

    protected function kasirDashboard()
    {
        $today = now()->startOfDay();

        $todayTransactions = Transaction::whereDate('created_at', $today)->count();
        $pendingTransactions = Transaction::where('status', 'pending')->count();
        $todayRevenue = Transaction::where('status', 'paid')->whereDate('paid_at', $today)->sum('total');

        // Revenue trend for the last 7 days
        $revenueTrend = Transaction::selectRaw('DATE(created_at) as date, SUM(total) as total')
            ->where('status', 'paid')
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => date('D', strtotime($item->date)),
                    'total' => (float) $item->total,
                ];
            });

        return Inertia::render('Dashboard/Kasir', [
            'todayTransactions' => $todayTransactions,
            'pendingTransactions' => $pendingTransactions,
            'todayRevenue' => $todayRevenue,
            'revenueTrend' => $revenueTrend,
            'recentTransactions' => Transaction::latest()->limit(5)->get(),
        ]);
    }
}
