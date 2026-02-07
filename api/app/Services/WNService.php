<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WNService
{
  protected int $lat;
  protected int $lng;

  public function __construct(int $lat, int $lng)
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
    return ($data['wxdata']['srf'][0]['wx'] ?? null) === 'rain';
  }
}
