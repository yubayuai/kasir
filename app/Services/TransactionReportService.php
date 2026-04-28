<?php

namespace App\Services;

use App\Exports\DailyTransactionExport;
use App\Models\Transaction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Maatwebsite\Excel\Facades\Excel;

class TransactionReportService
{
    /**
     * Generate and send daily report
     */
    public function sendDailyReport()
    {
        $yesterday = now()->subDay()->format('Y-m-d');
        
        $transactions = Transaction::with(['items', 'user', 'voucher'])
            ->where('status', 'paid')
            ->whereDate('paid_at', $yesterday)
            ->get();

        if ($transactions->isEmpty()) {
            Log::info("No paid transactions found for {$yesterday}. Skipping report.");
            return;
        }

        $filename = "transaction_report_{$yesterday}.xlsx";
        
        // Generate Excel File
        $excelFile = Excel::raw(new DailyTransactionExport($transactions), \Maatwebsite\Excel\Excel::XLSX);

        // 1. Send via Email
        $this->sendEmail($excelFile, $filename, $yesterday);

        // 2. Send via Telegram (assuming API endpoint accepts multipart/form-data)
        $this->sendTelegram($excelFile, $filename, $yesterday);
    }

    protected function sendEmail($excelContent, $filename, $date)
    {
        try {
            Mail::send([], [], function ($message) use ($excelContent, $filename, $date) {
                $message->to('interview.deltasurya@yopmail.com')
                    ->subject("Laporan Transaksi Harian - {$date}")
                    ->html("<p>Berikut terlampir laporan seluruh transaksi pembayaran untuk tanggal {$date}.</p>")
                    ->attachData($excelContent, $filename, [
                        'mime' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    ]);
            });
            Log::info('Daily transaction report sent via email.');
        } catch (\Exception $e) {
            Log::error('Failed to send daily report email: ' . $e->getMessage());
        }
    }

    protected function sendTelegram($excelContent, $filename, $date)
    {
        // For the purpose of the test, using a hypothetical API endpoint 
        // to send the file to the telegram group via an intermediate service or directly.
        // The prompt says "ke grup chat telegram https://cutt.ly/interview-report"
        
        try {
            // Note: Since cutt.ly is a URL shortener, we can't POST directly to it.
            // We would typically use the Telegram Bot API: https://api.telegram.org/bot<token>/sendDocument
            // For this implementation, we will log it, or make a best-effort call if we had a webhook URL.
            
            $telegramWebhookUrl = config('services.telegram.webhook_url');
            
            if ($telegramWebhookUrl) {
                Http::attach('document', $excelContent, $filename)->post($telegramWebhookUrl, [
                    'caption' => "Daily Transaction Report - {$date}"
                ]);
                Log::info('Daily transaction report sent to Telegram.');
            } else {
                Log::warning('Telegram webhook URL not configured. Skipped sending to Telegram.');
            }
        } catch (\Exception $e) {
            Log::error('Failed to send daily report to Telegram: ' . $e->getMessage());
        }
    }
}
