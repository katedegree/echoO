<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Post;
use App\Models\User;
use App\Responses\MutationResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LikeController extends Controller
{
  public function store(Request $request)
  {
    $user = $request->user();
    $post = Post::findOrFail($request->input('postId'));

    DB::transaction(function () use ($user, $post) {
      $inserted = DB::table('post_likes')->insertOrIgnore([
        'user_id' => $user->id,
        'post_id' => $post->id,
        'created_at' => now(),
        'updated_at' => now(),
      ]);

      if ($inserted) {
        User::where('id', $post->user_id)->increment('total_likes_count');
      }

      DB::table('user_likes')->upsert(
        [
          'liker_user_id' => $user->id,
          'liked_user_id' => $post->user_id,
          'created_at' => now(),
          'updated_at' => now(),
        ],
        ['liker_user_id', 'liked_user_id'],
        ['updated_at'],
      );

      if ($post->is_public && $user->id !== $post->user_id) {
        Message::create([
          'sender_user_id' => $user->id,
          'receiver_user_id' => $post->user_id,
          'content' => 'いいねしました！',
        ]);
      }
    });

    $responseUser = null;
    if (!$post->is_public) {
      $postUser = User::with('profile')->find($post->user_id);
      $responseUser = [
        'id' => $postUser->id,
        'name' => $postUser->profile->name,
      ];
    }

    return MutationResponse::success('いいねしました。')
      ->with('user', $responseUser)
      ->json(201);
  }
}
