<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MediaStoreRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    return [
      'media' => ['required', 'file', 'mimes:jpeg,png,gif,webp,mp4,mov,webm'],
    ];
  }

  public function messages(): array
  {
    return [
      'media.required' => 'ファイルを選択してください。',
      'media.file' => '有効なファイルをアップロードしてください。',
      'media.mimes' => '対応していない画像・動画形式です。',
    ];
  }
}

