<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Post extends Model
{
  protected $fillable = [
    'user_id',
    'content',
    'is_public',
    'is_posted',
  ];

  protected $casts = [
    'is_public' => 'boolean',
    'is_posted' => 'boolean',
  ];

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function likedUsers(): BelongsToMany
  {
    return $this->belongsToMany(User::class, 'post_likes');
  }

  public function media(): BelongsToMany
  {
    return $this->belongsToMany(Media::class, 'post_media');
  }
}
