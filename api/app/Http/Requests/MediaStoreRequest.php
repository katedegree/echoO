<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MediaStoreRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    $file = $this->file('media');
    $isVideo = $file && str_starts_with($file->getMimeType(), 'video/');

    return [
      'media' => [
        'required',
        'file',
        'mimes:jpeg,png,gif,webp,mp4,mov,webm',
        $isVideo ? 'max:51200' : 'max:5120',
      ],
    ];
  }

  public function messages(): array
  {
    $file = $this->file('media');
    $isVideo = $file && str_starts_with($file->getMimeType(), 'video/');

    return [
      'media.required' => 'ファイルを選択してください。',
      'media.file' => '有効なファイルをアップロードしてください。',
      'media.mimes' => '対応していない画像・動画形式です。',
      'media.max' => $isVideo
        ? '動画のファイルサイズは50MBまでです。'
        : '画像のファイルサイズは5MBまでです。',
      'media.uploaded' => 'ファイルのアップロードに失敗しました。',
    ];
  }
}
