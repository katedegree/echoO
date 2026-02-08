<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostStoreRequest;
use App\Models\Message;
use App\Models\Post;
use App\Models\User;
use App\Responses\MutationResponse;
use App\Responses\QueryResponse;
use App\Services\WNService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostController extends Controller
{
  public function index(Request $request)
  {
    $limit = $request->input('limit');
    $offset = $request->input('offset');
    $userId = $request->input('userId');

    $me = $request->user();

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
      ->flatMap(function (User $user) use ($me, $userId) {
        $isMe = $me && $me->id === $user->id;

        if ($isMe && $userId) {
          return $user->posts->map(fn($post) => [
            'id' => $post->id,
            'content' => $post->content,
            'media' => $post->media->map(fn($media) => [
              'id' => $media->id,
              'label' => $media->label,
              'url' => $media->url,
            ]),
            'likesCount' => $post->liked_users_count,
            'isPublic' => $post->is_public,
          ]);
        }

        $latestPost = $user->posts->first();
        $likesCount = $user->posts->sum('liked_users_count');

        return [[
          'id' => $latestPost->id,
          'content' => $latestPost->content,
          'media' => $latestPost->media->map(fn($media) => [
            'id' => $media->id,
            'label' => $media->label,
            'url' => $media->url,
          ]),
          'likesCount' => $likesCount,
          'isPublic' => $latestPost->is_public,
        ]];
      });

    return QueryResponse::success($posts)->json();
  }

  public function store(PostStoreRequest $request)
  {
    $user = $request->user();
    $wnService = new WNService($request->input('lat'), $request->input('lng'));
    $isPublic = !$wnService->isRain();

    if ($request->boolean('isPublic') !== $isPublic) {
      return MutationResponse::error('投稿に失敗しました。')->json(422);
    }

    DB::transaction(function () use ($user, $request, $isPublic) {
      $post = $user->posts()->create([
        'content' => $request->input('content'),
        'is_public' => $isPublic,
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

      if ($post->is_public && $user->id !== $post->user_id) {
        Message::create([
          'sender_user_id' => $user->id,
          'receiver_user_id' => $post->user_id,
          'content' => 'いいねしました！',
        ]);
      }
    });

    return MutationResponse::success('いいねしました。')
      ->with('user', $post->is_public ? null : [
        'id' => $post->user->id,
        'name' => $post->user->profile->name,
      ])
      ->json(201);
  }
}
