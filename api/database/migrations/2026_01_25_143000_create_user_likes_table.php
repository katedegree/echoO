<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('user_likes', function (Blueprint $table) {
      $table->unsignedBigInteger('liker_user_id');
      $table->unsignedBigInteger('liked_user_id');
      $table->timestamps();

      $table->primary(['liker_user_id', 'liked_user_id']);

      $table->foreign('liker_user_id')
        ->references('id')
        ->on('users')
        ->cascadeOnDelete();
      $table->foreign('liked_user_id')
        ->references('id')
        ->on('users')
        ->cascadeOnDelete();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('user_likes');
  }
};
