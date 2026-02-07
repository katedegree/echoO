<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostStoreRequest;
use App\Models\Post;
use App\Models\User;
use App\Responses\MutationResponse;
use App\Responses\QueryResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostController extends Controller
{
  public function index(Request $request)
  {
    $limit = $request->input('limit');
    $offset = $request->input('offset');
    $userId = $request->input('userId');

    $posts = User::query()
      ->when($userId, fn($q) => $q->where('id', $userId))
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
              'id' => $media->id,
              'label' => $media->label,
              'url' => $media->url,
            ];
          }),
          'likesCount' => $likesCount,
        ];
      });

    return QueryResponse::success($posts)->json();
  }

  public function store(PostStoreRequest $request)
  {
    $user = $request->user();

    DB::transaction(function () use ($user, $request) {
      $post = $user->posts()->create([
        'content' => $request->input('content'),
      ]);

      $post->media()->attach($request->input('mediaIds'));

      $user->update(['posted_at' => now()]);
    });

    return MutationResponse::success('投稿しました。')->json(201);
  }

  public function like($id)
  {
    $user = request()->user();
    $post = Post::with(['user.profile.iconMedia'])->findOrFail($id);

    DB::transaction(function () use ($user, $post) {
      $user->likedPosts()->syncWithoutDetaching([$post->id]);
      // NOTE: 中間テーブル[user_likes]のupdated_atを更新
      $user->likedUsers()->syncWithoutDetaching([
        $post->user_id => ['updated_at' => now()],
      ]);
    });

    return MutationResponse::success('いいねしました。')
      ->with('user', [
        'id' => $post->user->id,
        'name' => $post->user->profile->name,
        'iconUrl' => $post->user->profile->iconMedia?->url
      ])
      ->json(201);
  }
}
