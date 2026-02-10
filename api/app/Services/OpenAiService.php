<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAiService
{
  protected string $apiKey;

  public function __construct()
  {
    $this->apiKey = config('openai.key');
  }

  public function isNsfw(UploadedFile $file): bool
  {
    if (!$this->apiKey) {
      return false;
    }

    $base64 = base64_encode(file_get_contents($file->getRealPath()));
    $mime = $file->getMimeType();

    /** @var Response $response */
    $response = Http::withHeaders([
      'Authorization' => 'Bearer ' . $this->apiKey,
    ])->post('https://api.openai.com/v1/moderations', [
      'model' => 'omni-moderation-latest',
      'input' => [
        [
          'type' => 'image_url',
          'image_url' => [
            'url' => "data:{$mime};base64,{$base64}",
          ],
        ],
      ],
    ]);

    if (!$response->successful()) {
      return false;
    }

    $result = $response->json('results.0', []);
    $scores = $result['category_scores'] ?? [];

    Log::info('Moderation scores', [
      'sexual' => $scores['sexual'] ?? 0,
      'sexual/minors' => $scores['sexual/minors'] ?? 0,
    ]);

    return ($scores['sexual'] ?? 0) >= 0.2
      || ($scores['sexual/minors'] ?? 0) >= 0.1;
  }
}
