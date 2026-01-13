<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Responses\QueryResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
  public function index(Request $request)
  {
    $limit = $request->input('limit');
    $offset = $request->input('offset');

    $posts = User::query()
      ->whereNotNull('posted_at')
      ->with([
        'profile',
        'profile.iconMedia',
        'posts' => fn($q) => $q->latest()->withCount('likedUsers'),
        'posts.media'
      ])
      ->orderByDesc('posted_at')
      ->when($limit, fn($q) => $q->limit($limit))
      ->when($offset, fn($q) => $q->offset($offset))
      ->get()
      ->map(function (User $user) {
        // posted_atがnullでない場合、必ず投稿が存在する
        $latestPost = $user->posts->first();
        $likesCount = $user->posts->sum('liked_users_count');

        return [
          'id' => $latestPost->id,
          'content' => $latestPost->content,
          'media' => $latestPost->media->map(function ($media) {
            return [
              'label' => $media->label,
              'url' => $media->url,
            ];
          }),
          'user' => [
            'id' => $user->id,
            'name' => $user->profile->name,
            'iconUrl' => $user->profile->media?->url
          ],
          'likesCount' => $likesCount,
        ];
      });

    return QueryResponse::success($posts)->json();
  }
}
