<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DeltaSuryaApiService;
use App\Services\PricingService;
use Illuminate\Http\Request;

class ProcedureController extends Controller
{
    public function index(DeltaSuryaApiService $apiService)
    {
        return response()->json([
            'data' => $apiService->getProcedures()
        ]);
    }

    public function calculatePrice(Request $request, PricingService $pricingService)
    {
        $request->validate([
            'procedure_id' => 'required|string',
            'insurance_id' => 'nullable|string',
        ]);

        $price = $pricingService->getProcedurePriceForInsurance(
            $request->procedure_id,
            $request->insurance_id
        );

        return response()->json([
            'data' => [
                'price' => $price
            ]
        ]);
    }
}
