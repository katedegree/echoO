<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DmStoreRequest extends FormRequest
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
      'receiverUserId' => ['required', 'integer', 'exists:users,id'],
      'content' => ['required', 'string'],
      'mediaIds' => ['nullable', 'array'],
      'mediaIds.*' => ['integer', 'exists:media,id'],
    ];
  }

  public function messages(): array
  {
    return [
      'receiverUserId.required' => '送信先のユーザーが指定されていません。',
      'receiverUserId.integer' => '送信先のユーザーの形式が正しくありません。',
      'receiverUserId.exists' => '送信先のユーザーが見つかりません。',
      'content.required' => 'メッセージを入力してください。',
      'content.string' => 'メッセージは文字列で入力してください。',
      'mediaIds.array' => 'メディアの形式が正しくありません。',
      'mediaIds.*.integer' => 'メディアの形式が正しくありません。',
      'mediaIds.*.exists' => '選択されたメディアが見つかりません。',
    ];
  }
}
