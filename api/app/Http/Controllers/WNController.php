<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Responses\QueryResponse;
use App\Services\WNService;
use Illuminate\Http\Request;

class WNController extends Controller
{
  public function isRain(Request $request)
  {
    $lat = $request->input('lat');
    $lng = $request->input('lng');

    $wnService = new WNService($lat, $lng);
    $isRain = $wnService->isRain();

    $isPosted = false;
    if (!$isRain) {
      $user = $request->user();
      $updated = Post::where('user_id', $user->id)
        ->where('is_posted', false)
        ->update(['is_posted' => true]);
      $user->update(['posted_at' => now()]);
      $isPosted = $updated > 0;
    }

    return QueryResponse::success(['isRain' => $isRain, 'isPosted' => $isPosted])->json(200);
  }
}
