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
    Schema::create('profiles', function (Blueprint $table) {
      $table->unsignedBigInteger('user_id')->primary();
      $table->unsignedBigInteger('icon_media_id')->nullable();
      $table->string('name', 50);
      $table->string('bio', 160)->nullable();
      $table->timestamps();

      $table->foreign('user_id')
        ->references('id')
        ->on('users')
        ->cascadeOnDelete();
      $table->foreign('icon_media_id')
        ->references('id')
        ->on('media')
        ->restrictOnDelete();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('profiles');
  }
};
