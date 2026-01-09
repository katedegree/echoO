<?php

namespace App\Responses;

use Illuminate\Http\JsonResponse;

enum MutationResponseStatus: string
{
  case Success = 'success';
  case Error = 'error';
  case Validation = 'validation';

  public function httpCode(): int
  {
    return match ($this) {
      self::Success => 201,
      self::Error => 500,
      self::Validation => 422,
    };
  }
}

class MutationResponse
{
  protected MutationResponseStatus $status = MutationResponseStatus::Success;
  protected array $data = [];

  public static function success(string $message): self
  {
    $instance = new self();
    $instance->status = MutationResponseStatus::Success;
    $instance->data['message'] = $message;
    return $instance;
  }

  public static function error(string $message): self
  {
    $instance = new self();
    $instance->status = MutationResponseStatus::Error;
    $instance->data['message'] = $message;
    return $instance;
  }

  public static function validation(array $data): self
  {
    $instance = new self();
    $instance->status = MutationResponseStatus::Validation;
    $instance->data["messages"] = $data;
    return $instance;
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
