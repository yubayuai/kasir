<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionItem extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'transaction_id', 'procedure_id', 'procedure_name',
        'price', 'discount_amount', 'subtotal', 'quantity'
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
