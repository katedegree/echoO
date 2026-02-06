<?php

namespace App\Responses;

use Illuminate\Http\JsonResponse;

class QueryResponse
{
  private const HTTP_OK = 200;

  protected array $data;

  private function __construct(mixed $data)
  {
    $this->data['data'] = $data;
  }

  public static function success(mixed $data): self
  {
    return new self($data);
  }

  public function with(string $key, mixed $value): self
  {
    $this->data[$key] = $value;
    return $this;
  }

  public function json(): JsonResponse
  {
    return response()->json($this->data, self::HTTP_OK);
  }
}
