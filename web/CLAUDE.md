# フロントファイルからAPIエンドポイント作成時の手順

## 1. 前提
- バックエンドAPIはLaravelで実装されている
- web/src/lib/api/*の中身が`api定義ファイル`になる
- `Query` -> GET, `Mutaion` -> POST, PATCH, DELETE
- controller内のメソット順は一貫性を持つこと
- `file`のレスポンスがweb/src/lib/query-response.ts, web/src/lib/mutation-response.tsのいずれかに当てはまらない場合は、すぐに停止すること
- 以下の情報を必ずすり合わせること
```bash
file: フロントエンド側 `api定義ファイル`名
isAuth: authミドルウェアが必要かどうか
resource: コントローラー
action: メソッド
detail: 詳細（必要なら）
```
(例)
```bash
file: post-index.ts
isAuth: false
resource: post
action: index
detail: プロフィールページなどでも使うのでuserIdでの絞り込みが必要
```

## 2. api/routes/api.phpに、エンドポイントを追加
- `file`からエンドポイントを取得する
- `isAuth`に応じてAuthミドルウェア内かどうかを判断する
- `resource`に対応するcontrollerが存在しない場合はapi/app/Http/Controllersに作成する
- 必要に応じてapi.phpにcontrollerのuse文を追加する

## 3. Mutationリクエストの場合に、Requestを作成
- authorizeは基本的にfalseに設定する
- rulesを適切に設定する（長さ・サイズ制限は使わないこと）
- messagesを適切に設定する（ユーザーに表示される部分なので、ユーザーライクな文言にする）

## 4. Controllerの作成
- `resource`に対応するコントローラー内にpublic function `action`を作る
- バリデーション時のエラーはapi/bootstrap/app.phpでcatchしているので書かなくても問題ない
- レスポンス時のmessageはユーザーに表示されるので、適切に設定すること
- `Query`リクエストの場合
  - App\Responses\QueryResponseを使用
  - エラーは起きない前提、もしエラーが起きた場合はNoContent + Error Status Codeで問題ない
- `Mutaiton`リクエストの場合
  - App\Responses\MutationResponseを使用
  - エラー時もApp\Responses\MutationResponseを使用

## 5. モデルにリレーション作る際のの命名規則
（Hogeは意味合いが通じるようするための1単語）
- 外部キー名に意味がある（テーブル名+idではない）場合 -> `Hoge+モデル名の単数形 or 複数形`
- 中間テーブル名に意味がある（テーブル名を繋げた命名ではない）場合 -> `Hoge+モデル名の単数形 or 複数形`
- その他 -> `モデル名の単数形 or 複数形`
