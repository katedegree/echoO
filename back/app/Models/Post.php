<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Post extends Model
{
  protected $fillable = [
    'user_id',
    'content',
    'is_public',
  ];

  protected $casts = [
    'is_public' => 'boolean',
  ];

  public function likedUsers(): BelongsToMany
  {
    return $this->belongsToMany(User::class, 'likes');
  }

  public function media(): BelongsToMany
  {
    return $this->belongsToMany(Media::class, 'post_media');
  }
}
