<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
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
    Log::info('WNService response', $data['wxdata']);

    return ($data['wxdata'][0]['srf'][0]['wx'] ?? null) === 300;
  }
}
