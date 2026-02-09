<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Services\WNService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
  Route::get('/israin', function (Request $request) {
    $lat = $request->input('lat');
    $lng = $request->input('lng');

    $wnService = new WNService($lat, $lng);
    return response()->json($wnService->isRain());
  });
  Route::prefix('auth')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
  });
  Route::prefix('users')->group(function () {
    Route::get('/{id}', [UserController::class, 'show']);
    Route::patch('/', [UserController::class, 'update']);
  });
  Route::prefix('posts')->group(function () {
    Route::post('/', [PostController::class, 'store']);
  });
  Route::prefix('likes')->group(function () {
    Route::post('/', [LikeController::class, 'store']);
  });
  Route::prefix('media')->group(function () {
    Route::post('/', [MediaController::class, 'store']);
  });
});

Route::prefix('auth')->group(function () {
  Route::post('/register', [AuthController::class, 'register']);
  Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth.optional')->group(function () {
  Route::prefix('posts')->group(function () {
    Route::get('/', [PostController::class, 'index']);
  });
});
