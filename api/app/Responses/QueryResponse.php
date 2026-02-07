<?php

namespace App\Responses;

use Illuminate\Http\JsonResponse;

class QueryResponse
{
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

  public function json(int $code = 200): JsonResponse
  {
    return response()->json($this->data, $code);
  }
}
