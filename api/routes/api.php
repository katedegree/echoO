<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
  Route::prefix('auth')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
  });
  Route::prefix('users')->group(function () {
    Route::get('/{id}', [UserController::class, 'show']);
  });
  Route::prefix('posts')->group(function () {
    Route::post('/{id}/like', [PostController::class, 'like']);
  });
});

Route::prefix('auth')->group(function () {
  Route::post('/register', [AuthController::class, 'register']);
  Route::post('/login', [AuthController::class, 'login']);
});

Route::prefix('posts')->group(function () {
  Route::get('/', [PostController::class, 'index']);
});
