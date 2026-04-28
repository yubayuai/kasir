<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

\Illuminate\Support\Facades\Schedule::call(function () {
    $service = app(\App\Services\TransactionReportService::class);
    $service->sendDailyReport();
})->dailyAt('01:00')->name('send-daily-transaction-report')->withoutOverlapping();
