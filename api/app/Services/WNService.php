<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class WNService
{
  protected float $lat;
  protected float $lng;

  public function __construct(float $lat, float $lng)
  {
    $this->lat = $lat;
    $this->lng = $lng;
  }

  public function isRain(): bool
  {
    /** @var Response $response */
    $response = Http::withHeaders([
      'X-Api-Key' => config('wn.key'),
    ])->get('https://wxtech.weathernews.com/api/v1/ss1wx', [
      'lat' => $this->lat,
      'lon' => $this->lng,
    ]);

    if (!$response->ok()) {
      return false;
    }

    $data = $response->json();
    $srf = collect($data['wxdata'][0]['srf'] ?? []);

    if ($srf->isEmpty()) {
      return false;
    }

    $baseDate = Carbon::parse($srf->first()['date']);
    $threshold = $baseDate->copy()->addMinutes(30);

    $isRain = $srf
      ->filter(fn($entry) => Carbon::parse($entry['date'])->lte($threshold))
      ->contains(fn($entry) => ($entry['wx'] ?? null) === 300);

    Log::info('WNService', [
      'lat' => $this->lat,
      'lng' => $this->lng,
      'baseDate' => $baseDate->toIso8601String(),
      'isRain' => $isRain,
    ]);

    return $isRain;
  }
}
