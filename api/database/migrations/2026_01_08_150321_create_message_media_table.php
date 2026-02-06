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
    Schema::create('message_media', function (Blueprint $table) {
      $table->unsignedBigInteger('message_id');
      $table->unsignedBigInteger('media_id');
      $table->timestamps();

      $table->primary(['message_id', 'media_id']);

      $table->foreign('message_id')
        ->references('id')
        ->on('messages')
        ->cascadeOnDelete();
      $table->foreign('media_id')
        ->references('id')
        ->on('media')
        ->cascadeOnDelete();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('message_media');
  }
};
