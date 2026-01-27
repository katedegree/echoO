<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
  use WithoutModelEvents;

  /**
   * Seed the application's database.
   */
  public function run(): void
  {
    DB::transaction(function () {
      User::whereIn('id', [1, 2, 3])->delete();
      Post::whereIn('id', [1, 2, 3, 4, 5])->delete();

      $imageUrl = 'https://placehold.jp/300x200.png';
      $videoUrl = 'https://placeholder.terrahq.com/1-min-video.mp4';

      /** 
       * @var array<int, array{
       *   id: int,
       *   email: string,
       *   password: string,
       *   profile?: array{name: string},
       *   posts?: array<int, array{
       *     id: int,
       *     content: string,
       *     is_public: bool,
       *     media?: array<int, array{label: string, url: string}>
       *   }>
       * }>
       */
      $users = [
        [
          'id' => 1,
          'email' => 'nakao1@gmail.com',
          'password' => 'password',
          'profile' => [
            'name' => 'nakao1'
          ],
          'posts' => [
            [
              'id' => 1,
              'content' => 'nakao1の投稿',
              'is_public' => true,
              'media' => [
                [
                  'label' => 'posts/image',
                  'url' => $imageUrl
                ],
                [
                  'label' => 'posts/video',
                  'url' => $videoUrl
                ]
              ]
            ]
          ]
        ],
        [
          'id' => 2,
          'email' => 'nakao2@gmail.com',
          'password' => 'password',
          'profile' => [
            'name' => 'nakao2'
          ]
        ],
        [
          'id' => 3,
          'email' => 'nakao3@gmail.com',
          'password' => 'password',
          'profile' => [
            'name' => 'nakao3'
          ]
        ],
      ];
      $postLikes = [
        [
          'user_id' => 1,
          'post_id' => 1
        ],
        [
          'user_id' => 2,
          'post_id' => 1
        ],
        [
          'user_id' => 3,
          'post_id' => 1
        ],
      ];
      $userLikes = [
        [
          'liker_user_id' => 2,
          'liked_user_id' => 1,
          'updated_at' => now(),
          'created_at' => now(),
        ],
        [
          'liker_user_id' => 3,
          'liked_user_id' => 1,
          'updated_at' => now(),
          'created_at' => now(),
        ],
      ];

      foreach ($users as $user) {
        $now = now();
        $profile = $user['profile'] ?? [];
        $posts = $user['posts'] ?? [];

        $createdUser = User::create([
          'id' => $user['id'],
          'email' => $user['email'],
          'password' => Hash::make($user['password']),
          'posted_at' => $posts ? $now : null
        ]);

        $createdUser->profile()->create([
          'name' => $profile['name']
        ]);
        foreach ($posts as $post) {
          $createdPost = $createdUser->posts()->create([
            'id' => $post['id'],
            'content' => $post['content'],
            'is_public' => $post['is_public'],
            'created_at' => $now
          ]);

          $media = $post['media'] ?? [];
          $createdPost->media()->createMany($media);
        }
      }
      DB::table('post_likes')->insert($postLikes);
      DB::table('user_likes')->insert($userLikes);
    });
  }
}
