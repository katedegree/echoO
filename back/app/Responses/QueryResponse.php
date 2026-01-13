<?php

namespace App\Responses;

use Illuminate\Http\JsonResponse;

class QueryResponse
{
  private const HTTP_OK = 200;

  protected mixed $data;
  protected array $headers = [];

  private function __construct(mixed $data)
  {
    $this->data = $data;
  }

  public static function success(mixed $data): self
  {
    return new self($data);
  }

  public function withHeader(string $key, string $value): self
  {
    $this->headers[$key] = $value;
    return $this;
  }

  public function json(): JsonResponse
  {
    return response()->json($this->data, self::HTTP_OK, $this->headers)
      ->header('Access-Control-Expose-Headers', implode(',', array_keys($this->headers)));
  }
}
