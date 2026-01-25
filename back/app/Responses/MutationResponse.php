<?php

namespace App\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;

enum MutationResponseStatus: string
{
  case Success = 'success';
  case Error = 'error';
  case Validation = 'validation';

  public function httpCode(): int
  {
    return match ($this) {
      self::Success => 200,
      self::Error => 500,
      self::Validation => 422,
    };
  }
}

class MutationResponse
{
  protected MutationResponseStatus $status;
  protected array $data;

  private function __construct(
    MutationResponseStatus $status,
    array $data = []
  ) {
    $this->status = $status;
    $this->data = $data;
  }

  public static function success(string $message): self
  {
    return new self(
      MutationResponseStatus::Success,
      ['message' => $message]
    );
  }

  public static function error(string $message): self
  {
    return new self(
      MutationResponseStatus::Error,
      ['message' => $message]
    );
  }

  public static function validation(array | Collection $fieldErrors): self
  {
    if ($fieldErrors instanceof Collection) {
      $fieldErrors = $fieldErrors->toArray();
    }
    return new self(
      MutationResponseStatus::Validation,
      ['fieldErrors' => $fieldErrors]
    );
  }

  public function with(string $key, mixed $value): self
  {
    $this->data[$key] = $value;
    return $this;
  }

  public function json(): JsonResponse
  {
    return response()->json(
      collect(['status' => $this->status->value])->merge($this->data),
      $this->status->httpCode()
    );
  }
}
