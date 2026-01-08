<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
  protected $fillable = [
    'sender_user_id',
    'receiver_user_id',
    'content',
  ];
}
