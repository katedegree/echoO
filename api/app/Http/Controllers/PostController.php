<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostStoreRequest;
use App\Models\Post;
use App\Models\User;
use App\Responses\MutationResponse;
use App\Responses\QueryResponse;
use App\Services\WNService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostController extends Controller
{
  // NOTE: 取得ロジック
  // $userIdを指定しない場合 -> 全てのユーザーの最新の投稿1件を返す
  // $me->idと$userIdが同じ場合 -> 全ての投稿を返す
  // $me->idと$userIdが異なる場合 -> $userIdの最新の投稿1件を返す

  // 最新の投稿1件を返す場合 -> 投稿ユーザーの累計いいねをlikesCountとする
  // 全ての投稿を返す場合 -> 投稿それぞれのいいねをlikesCountとする
  public function index(Request $request)
  {
    $limit = $request->input('limit');
    $userId = $request->input('userId');

    $me = $request->user();
    $isMe = $me && $userId && $me->id == $userId;

    if ($isMe) {
      // 自分の全投稿 -> 投稿ごとのいいね数
      $posts = Post::where('user_id', $me->id)
        ->withCount('likedUsers')
        ->with('media')
        ->latest()
        ->get()
        ->map(fn($post) => [
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

      return QueryResponse::success($posts)->json();
    }

    // フィード or 他人のプロフィール -> 最新の投稿1件 + 累計いいね
    $cursor = $request->input('cursor');

    $users = User::query()
      ->when($userId, fn($q) => $q->where('id', $userId))
      ->whereNotNull('posted_at')
      ->when($cursor, fn($q) => $q->where('posted_at', '<', $cursor))
      ->orderByDesc('posted_at')
      ->when($limit, fn($q) => $q->limit($limit))
      ->get();

    $userIds = $users->pluck('id');

    // 各ユーザーの最新投稿IDを1クエリで取得（is_postedがtrueのもののみ）
    $latestPostIds = Post::whereIn('user_id', $userIds)
      ->where('is_posted', true)
      ->selectRaw('MAX(id) as id')
      ->groupBy('user_id')
      ->pluck('id');

    $latestPosts = Post::whereIn('id', $latestPostIds)
      ->with('media')
      ->get()
      ->keyBy('user_id');

    $posts = $users
      ->map(function ($user) use ($latestPosts) {
        $post = $latestPosts->get($user->id);
        if (!$post) return null;

        return [
          'id' => $post->id,
          'content' => $post->content,
          'media' => $post->media->map(fn($media) => [
            'id' => $media->id,
            'label' => $media->label,
            'url' => $media->url,
          ]),
          'likesCount' => $user->total_likes_count,
          'isPublic' => $post->is_public,
        ];
      })
      ->filter()
      ->values();

    $nextCursor = $users->last()?->posted_at?->toISOString();

    return QueryResponse::success($posts)
      ->with('cursor', $nextCursor)
      ->json();
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
        'is_posted' => $isPublic,
      ]);

      $post->media()->attach($request->input('mediaIds'));

      if ($isPublic) {
        $user->update(['posted_at' => now()]);
      }
    });

    return MutationResponse::success('投稿しました。')->json(201);
  }
}
