# 非正規化カラムの更新ルール

以下のカラムはパフォーマンスのために非正規化されている。
関連データの変更時に必ず同期すること。

| カラム | 更新タイミング | 値 |
|---|---|---|
| `users.posted_at` | Post追加時 | `now()` |
| `users.posted_at` | Post削除時 | 直前のPostの`created_at`（なければ`null`） |
| `users.total_likes_count` | Post削除時 | 該当Postのいいね数を減算 |
| `users.total_likes_count` | Like追加時 | `+1` |
| `users.total_likes_count` | Like削除時 | `-1` |
