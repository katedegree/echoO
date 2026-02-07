<?php

namespace App\Http\Controllers;

use App\Http\Requests\MediaStoreRequest;
use App\Models\Media;
use App\Responses\MutationResponse;
use App\Services\S3Service;

class MediaController extends Controller
{
  public function store(MediaStoreRequest $request, S3Service $s3Service)
  {
    $file = $request->file('media');
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
