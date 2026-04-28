<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DeltaSuryaApiService;

class InsuranceController extends Controller
{
    public function index(DeltaSuryaApiService $apiService)
    {
        return response()->json([
            'data' => $apiService->getInsurances()
        ]);
    }
}
