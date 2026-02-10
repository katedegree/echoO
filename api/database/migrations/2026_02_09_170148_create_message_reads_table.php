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
    Schema::create('message_reads', function (Blueprint $table) {
      $table->unsignedBigInteger('user_id');
      $table->unsignedBigInteger('message_id');
      $table->timestamps();

      $table->primary(['user_id', 'message_id']);

      $table->foreign('user_id')
        ->references('id')
        ->on('users')
        ->cascadeOnDelete();
      $table->foreign('message_id')
        ->references('id')
        ->on('messages')
        ->cascadeOnDelete();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('message_reads');
  }
};
