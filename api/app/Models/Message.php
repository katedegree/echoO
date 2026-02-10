<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Message extends Model
{
  protected $fillable = [
    'sender_user_id',
    'receiver_user_id',
    'content',
  ];

  public function media(): BelongsToMany
  {
    return $this->belongsToMany(Media::class, 'message_media');
  }
}
