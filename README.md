# 立替メモ - 自動同期機能の設定方法

## 自動同期機能について

このアプリは、Firebase Realtime Database を使用して複数の端末間で自動的にデータを同期します。

## Firebase の設定手順

### 1. Firebase プロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: `kakeibo-app`）
4. Google Analytics の設定は任意（スキップ可能）
5. 「プロジェクトを作成」をクリック

### 2. Realtime Database の有効化

1. Firebase Console でプロジェクトを開く
2. 左メニューから「Realtime Database」を選択
3. 「データベースの作成」をクリック
4. ロケーションを選択（例: `asia-northeast1`）
5. 「テストモードで開始」を選択（開発用）
6. 「有効にする」をクリック

### 3. 設定情報の取得

1. Firebase Console の左メニューから「プロジェクトの設定」（⚙️アイコン）を選択
2. 「アプリを追加」→「ウェブ」（</>アイコン）を選択
3. アプリのニックネームを入力（例: `kakeibo-web`）
4. 「アプリを登録」をクリック
5. 表示される設定情報をコピー

### 4. firebase-config.js の設定

`firebase-config.js` ファイルを開き、取得した設定情報を入力してください：

```javascript
const firebaseConfig = {
  apiKey: "取得したAPIキー",
  authDomain: "プロジェクトID.firebaseapp.com",
  projectId: "プロジェクトID",
  databaseURL: "https://プロジェクトID-default-rtdb.firebaseio.com/",
  storageBucket: "プロジェクトID.appspot.com",
  messagingSenderId: "メッセージング送信者ID",
  appId: "アプリID"
};
```

### 5. セキュリティルールの設定（重要）

Firebase Console の「Realtime Database」→「ルール」タブで、以下のルールを設定してください：

```json
{
  "rules": {
    "kakeibo": {
      ".read": true,
      ".write": true
    }
  }
}
```

**注意**: この設定は開発用です。本番環境では認証を追加することをお勧めします。

## 使用方法

1. Firebase の設定が完了すると、自動的に同期が開始されます
2. 別の端末で同じアプリを開くと、自動的にデータが同期されます
3. データを追加・削除すると、リアルタイムで他の端末に反映されます
4. 同期状態は画面上部に表示されます

## ローカルモード（Firebase 未設定時）

Firebase を設定しない場合でも、アプリはローカルストレージを使用して動作します。この場合、エクスポート/インポート機能を使用して手動でデータを同期できます。

