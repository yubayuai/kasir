<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Transaction extends Model
{
    use HasFactory, HasUuids, LogsActivity;

    protected $fillable = [
        'transaction_number', 'user_id', 'patient_name', 'patient_id',
        'insurance_id', 'insurance_name', 'voucher_id', 'subtotal',
        'discount_amount', 'total', 'status', 'paid_at'
    ];

    protected $casts = [
        'paid_at' => 'datetime',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty();
    }

    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }
}
