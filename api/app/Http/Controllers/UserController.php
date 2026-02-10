<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use App\Responses\MutationResponse;
use App\Responses\QueryResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
  public function show($id)
  {
    $user = request()->user();
    // NOTE: パラメーターの$idは文字列型なので == で比較する
    $isMe = $id == $user->id;
    $isLiked = DB::table('user_likes')
      ->where(function ($q) use ($user, $id) {
        $q->where('liker_user_id', $user->id)->where('liked_user_id', $id);
      })
      ->orWhere(function ($q) use ($user, $id) {
        $q->where('liker_user_id', $id)->where('liked_user_id', $user->id);
      })
      ->exists();

    // NOTE: 基本的にここは不正リクエスト
    if (!$isMe && !$isLiked) {
      abort(403);
    }

    $user = User::findOrFail($id)->load([
      'profile.iconMedia',
      'posts' => fn($q) => $q->withCount('likedUsers'),
    ]);
    $me = [
      "id" => $user->id,
      "name" => $user->profile->name,
      "bio" => $user->profile->bio,
      "iconUrl" => $user->profile?->iconMedia->url ?? null,
      "likesCount" => $user->posts->sum('liked_users_count'),
    ];

    return QueryResponse::success($me)->json();
  }

  public function update(UserUpdateRequest $request)
  {
    $user = $request->user();

    if ($request->filled('email')) {
      $user->update(['email' => $request->input('email')]);
    }

    $user->profile()->update(array_filter([
      'name' => $request->input('name'),
      'bio' => $request->input('bio'),
      'icon_media_id' => $request->input('iconId'),
    ], fn($value) => $value !== null));

    return MutationResponse::success('プロフィールを更新しました。')->json(200);
  }
}
