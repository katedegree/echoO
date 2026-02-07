<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PostStoreRequest extends FormRequest
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
      'content' => ['required', 'string'],
      'mediaIds' => ['required', 'array'],
      'mediaIds.*' => ['integer', 'exists:media,id'],
    ];
  }

  public function messages(): array
  {
    return [
      'content.required' => '投稿内容を入力してください。',
      'content.string' => '投稿内容は文字列で入力してください。',
      'mediaIds.required' => 'メディアを選択してください。',
      'mediaIds.array' => 'メディアの形式が正しくありません。',
      'mediaIds.*.integer' => 'メディアの形式が正しくありません。',
      'mediaIds.*.exists' => '選択されたメディアが見つかりません。',
    ];
  }
}
