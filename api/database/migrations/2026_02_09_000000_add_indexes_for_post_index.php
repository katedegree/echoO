<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::table('users', function (Blueprint $table) {
      $table->index('posted_at');
    });

    Schema::table('posts', function (Blueprint $table) {
      $table->index(['user_id', 'created_at']);
    });

    Schema::table('post_likes', function (Blueprint $table) {
      $table->index('post_id');
    });
  }

  public function down(): void
  {
    Schema::table('users', function (Blueprint $table) {
      $table->dropIndex(['posted_at']);
    });

    Schema::table('posts', function (Blueprint $table) {
      $table->dropIndex(['user_id', 'created_at']);
    });

    Schema::table('post_likes', function (Blueprint $table) {
      $table->dropIndex(['post_id']);
    });
  }
};
