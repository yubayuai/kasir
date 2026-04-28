<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

/**
 * @property string $id
 * @property string $name
 * @property string $code
 * @property string|null $insurance_id
 * @property string|null $insurance_name
 * @property string $discount_type
 * @property float $discount_value
 * @property float|null $max_discount
 * @property \Illuminate\Support\Carbon|null $valid_from
 * @property \Illuminate\Support\Carbon|null $valid_until
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 */
class Voucher extends Model
{
    use HasFactory, HasUuids, SoftDeletes, LogsActivity;
    
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->code)) {
                $model->code = 'VCHR-' . strtoupper(\Illuminate\Support\Str::random(8));
            }
        });
    }

    protected $fillable = [
        'name', 'code', 'insurance_id', 'insurance_name', 'discount_type',
        'discount_value', 'max_discount', 'valid_from', 'valid_until', 'is_active'
    ];

    protected $casts = [
        'valid_from' => 'date',
        'valid_until' => 'date',
        'is_active' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty();
    }
}
