<?php

namespace App\Http\Controllers;

use App\Http\Requests\MediaStoreRequest;
use App\Models\Media;
use App\Responses\MutationResponse;
use App\Services\OpenAiService;
use App\Services\S3Service;

class MediaController extends Controller
{
  public function store(MediaStoreRequest $request, S3Service $s3Service, OpenAiService $moderationService)
  {
    $file = $request->file('media');

    if ($file->getMimeType() && str_starts_with($file->getMimeType(), 'image/')) {
      if ($moderationService->isNsfw($file)) {
        return MutationResponse::error('不適切な画像が検出されました。')->json(422);
      }
    }

    $url = $s3Service->upload($file, 'media');

    $media = Media::create([
      'url' => $url,
      'label' => $file->getClientOriginalName(),
    ]);

    return MutationResponse::success('アップロードしました。')
      ->with('mediaId', $media->id)
      ->with('mediaUrl', $media->url)
      ->json(201);
  }
}
