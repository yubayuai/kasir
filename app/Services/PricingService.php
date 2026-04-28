<?php

namespace App\Services;

use App\Models\Voucher;

class PricingService
{
    public function __construct(
        protected DeltaSuryaApiService $apiService
    ) {}

    /**
     * Calculate discount for a single item based on voucher
     */
    public function calculateItemDiscount(float $price, ?Voucher $voucher, ?string $insuranceId): float
    {
        if (!$voucher || !$voucher->is_active || !$insuranceId) {
            return 0;
        }

        // Verify voucher is valid for this insurance (match by ID or Name)
        $isMatch = ($voucher->insurance_id === $insuranceId) || 
                   ($insuranceId && $voucher->insurance_name && stripos($insuranceId, $voucher->insurance_name) !== false) ||
                   ($insuranceId && $voucher->insurance_name && stripos($voucher->insurance_name, $insuranceId) !== false);

        if (!$isMatch) {
            \Illuminate\Support\Facades\Log::info('Voucher Mismatch', [
                'voucher_ins_id' => $voucher->insurance_id,
                'voucher_ins_name' => $voucher->insurance_name,
                'requested_ins_id' => $insuranceId,
            ]);
            return 0;
        }

        // Verify validity period
        $now = now()->startOfDay();
        if ($voucher->valid_from && $now->lt($voucher->valid_from)) {
            return 0;
        }
        if ($voucher->valid_until && $now->gt($voucher->valid_until)) {
            return 0;
        }

        if ($voucher->discount_type === 'percentage') {
            $discount = $price * ($voucher->discount_value / 100);
            
            // Apply max discount cap if set
            if ($voucher->max_discount && $discount > $voucher->max_discount) {
                return $voucher->max_discount;
            }
            
            return $discount;
        }

        if ($voucher->discount_type === 'fixed') {
            // Fixed discount cannot exceed item price
            return min($price, $voucher->discount_value);
        }

        return 0;
    }

    /**
     * Calculate price for a procedure, considering insurance type
     */
    public function getProcedurePriceForInsurance(string $procedureId, ?string $insuranceId): float
    {
        $prices = $this->apiService->getProcedurePrices($procedureId);
        
        // Find price matching the insurance
        if ($insuranceId) {
            foreach ($prices as $price) {
                if (isset($price['insurance_id']) && $price['insurance_id'] === $insuranceId) {
                    return (float) $price['price'];
                }
            }
        }

        // Fallback to absolute fallback: just take the first price available
        if (!empty($prices)) {
            return (float) $prices[0]['price'];
        }

        return 0;
    }
}
