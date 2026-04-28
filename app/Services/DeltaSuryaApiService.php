<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DeltaSuryaApiService
{
    protected string $baseUrl;
    protected string $email;
    protected string $password;

    public function __construct()
    {
        $this->baseUrl = config('services.delta_surya.base_url', env('API_DELTA_SURYA_BASE_URL', 'https://recruitment.rsdeltasurya.com/api/v1'));
        $this->email = config('services.delta_surya.email', env('API_DELTA_SURYA_EMAIL'));
        $this->password = config('services.delta_surya.password', env('API_DELTA_SURYA_PASSWORD'));
    }

    /**
     * Get or generate access token
     */
    public function getToken(): ?string
    {
        return Cache::remember('delta_surya_token', 80000, function () {
            try {
                $response = Http::post($this->baseUrl . '/auth', [
                    'email' => $this->email,
                    'password' => $this->password,
                ]);

                if ($response->successful()) {
                    return $response->json('access_token');
                }

                Log::error('Delta Surya API Auth Failed', ['response' => $response->body()]);
                return null;
            } catch (\Exception $e) {
                Log::error('Delta Surya API Auth Exception: ' . $e->getMessage());
                return null;
            }
        });
    }

    /**
     * Helper to make authenticated requests
     */
    protected function makeRequest(string $method, string $endpoint, array $data = [])
    {
        $token = $this->getToken();
        
        if (!$token) {
            throw new \Exception("Cannot authenticate with external API");
        }

        $url = $this->baseUrl . $endpoint;
        
        $response = Http::withToken($token)->$method($url, $data);

        // Simple retry logic if token expired
        if ($response->status() === 401) {
            Cache::forget('delta_surya_token');
            $token = $this->getToken();
            $response = Http::withToken($token)->$method($url, $data);
        }

        return $response;
    }

    /**
     * Get all insurances with mock fallback
     */
    public function getInsurances(): array
    {
        return Cache::remember('delta_surya_insurances', 3600, function () {
            try {
                $response = $this->makeRequest('get', '/insurances');
                if ($response->successful()) {
                    return $response->json('data', []);
                }
            } catch (\Exception $e) {
                Log::warning('API Insurance Fetch Failed, using mock data: ' . $e->getMessage());
            }

            // Mock Data Fallback
            return [
                ['id' => 'ins-1', 'name' => 'BPJS Kesehatan'],
                ['id' => 'ins-2', 'name' => 'Prudential'],
                ['id' => 'ins-3', 'name' => 'Allianz'],
                ['id' => 'ins-4', 'name' => 'Manulife'],
            ];
        });
    }

    /**
     * Get all procedures with mock fallback
     */
    public function getProcedures(): array
    {
        return Cache::remember('delta_surya_procedures', 3600, function () {
            try {
                $response = $this->makeRequest('get', '/procedures');
                if ($response->successful()) {
                    return $response->json('data', []);
                }
            } catch (\Exception $e) {
                Log::warning('API Procedure Fetch Failed, using mock data: ' . $e->getMessage());
            }

            // Mock Data Fallback
            return [
                ['id' => 'proc-1', 'name' => 'Konsultasi Dokter Umum'],
                ['id' => 'proc-2', 'name' => 'Konsultasi Dokter Spesialis'],
                ['id' => 'proc-3', 'name' => 'Cek Darah Lengkap'],
                ['id' => 'proc-4', 'name' => 'Rontgen Thorax'],
                ['id' => 'proc-5', 'name' => 'EKG'],
                ['id' => 'proc-6', 'name' => 'USG Abdomen'],
                ['id' => 'proc-7', 'name' => 'Rawat Luka Ringan'],
            ];
        });
    }

    /**
     * Get procedure prices with mock fallback
     */
    public function getProcedurePrices(string $procedureId): array
    {
        return Cache::remember('delta_surya_procedure_prices_' . $procedureId, 3600, function () use ($procedureId) {
            try {
                $response = $this->makeRequest('get', "/procedures/{$procedureId}/prices");
                if ($response->successful()) {
                    return $response->json('data', []);
                }
            } catch (\Exception $e) {
                Log::warning('API Price Fetch Failed, using mock data: ' . $e->getMessage());
            }

            // Mock Price Fallback based on ID
            $basePrice = 100000;
            if (str_contains($procedureId, 'proc-2')) $basePrice = 250000;
            if (str_contains($procedureId, 'proc-3')) $basePrice = 150000;
            if (str_contains($procedureId, 'proc-4')) $basePrice = 300000;
            if (str_contains($procedureId, 'proc-6')) $basePrice = 450000;

            return [
                ['insurance_id' => null, 'price' => $basePrice], // Public price
                ['insurance_id' => 'ins-1', 'price' => $basePrice * 0.8], // BPJS discount
                ['insurance_id' => 'ins-2', 'price' => $basePrice * 0.95],
                ['insurance_id' => 'ins-3', 'price' => $basePrice * 0.95],
                ['insurance_id' => 'ins-4', 'price' => $basePrice * 0.95],
            ];
        });
    }
}
