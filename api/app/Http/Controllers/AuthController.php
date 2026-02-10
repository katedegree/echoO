<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthLoginRequest;
use App\Http\Requests\AuthRegisterRequest;
use App\Models\Message;
use App\Models\User;
use App\Responses\MutationResponse;
use App\Responses\QueryResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
  public const TOKEN_KEY = 'accessToken';

  public function register(AuthRegisterRequest $request)
  {
    $name = $request->input('name');
    $email = $request->input('email');
    $password = $request->input('password');

    $user = DB::transaction(function () use ($name, $email, $password) {
      $user = User::create([
        'email' => $email,
        'password' => Hash::make($password)
      ]);
      $user->profile()->create([
        'name' => $name,
      ]);
      return $user;
    });

    return MutationResponse::success('ユーザー登録が完了しました。')
      ->with('accessToken', $user->createToken(self::TOKEN_KEY)->plainTextToken)
      ->json(201);
  }

  public function login(AuthLoginRequest $request)
  {
    $email = $request->input('email');
    $password = $request->input('password');

    $user = User::where('email', $email)->first();

    if (!$user || !Hash::check($password, $user->password)) {
      return MutationResponse::error('メールアドレスまたはパスワードが違います。')->json(401);
    }

    return MutationResponse::success('ログインに成功しました。')
      ->with('accessToken', $user->createToken(self::TOKEN_KEY)->plainTextToken)
      ->json(200);
  }

  public function me()
  {
    $user = request()->user()->load([
      'profile.iconMedia',
      'likedPosts:id',
    ]);
    $me = [
      'id' => $user->id,
      'name' => $user->profile->name,
      'bio' => $user->profile->bio ?? '',
      'iconUrl' => $user->profile?->iconMedia->url ?? null,
      'likedPostIds' => $user->likedPosts->pluck('id')->toArray(),
    ];

    return QueryResponse::success($me)->json();
  }

  public function logout()
  {
    request()->user()->currentAccessToken()->delete();

    return MutationResponse::success('ログアウトしました。')->json(200);
  }

  public function destroy()
  {
    $user = request()->user();
    $user->currentAccessToken()->delete();

    DB::transaction(function () use ($user) {
      Message::where('sender_user_id', $user->id)
        ->orWhere('receiver_user_id', $user->id)
        ->delete();

      $user->delete();
    });

    return MutationResponse::success('アカウントを削除しました。')->json(200);
  }
}
