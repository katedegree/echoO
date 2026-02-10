<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
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
      'name' => ['sometimes', 'min:1', 'max:50'],
      'email' => ['nullable', 'string', 'email'],
      'bio' => ['nullable', 'string', 'max:160'],
      'iconId' => ['nullable', 'integer', 'exists:media,id'],
    ];
  }

  public function messages(): array
  {
    return [
      'name.min' => '名前を入力してください。',
      'name.max' => '名前は50文字以内で入力してください。',
      'email.string' => 'メールアドレスは文字列で入力してください。',
      'email.email' => 'メールアドレスの形式が正しくありません。',
      'bio.string' => '自己紹介は文字列で入力してください。',
      'bio.max' => '自己紹介は160文字以内で入力してください。',
      'iconId.integer' => 'アイコンの形式が正しくありません。',
      'iconId.exists' => '選択されたアイコンが見つかりません。',
    ];
  }
}
