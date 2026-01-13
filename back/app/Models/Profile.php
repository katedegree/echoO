<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
  protected $fillable = [
    'user_id',
    'icon_media_id',
    'name',
    'bio',
  ];

  public function iconMedia(): BelongsTo
  {
    return $this->belongsTo(Media::class, 'icon_media_id');
  }
}
