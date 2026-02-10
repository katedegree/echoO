<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\DmController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WNController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
  Route::prefix('wn')->group(function () {
    Route::get('/israin', [WNController::class, 'isRain']);
  });
  Route::prefix('auth')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::delete('/', [AuthController::class, 'destroy']);
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
  Route::prefix('dm')->group(function () {
    Route::get('/', [DmController::class, 'index']);
    Route::get('/unread', [DmController::class, 'unread']);
    Route::get('/{userId}', [DmController::class, 'show']);
    Route::post('/', [DmController::class, 'store']);
    Route::post('/{userId}/read', [DmController::class, 'read']);
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
