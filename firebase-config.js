// Firebase設定ファイル
// Firebase Console (https://console.firebase.google.com/) でプロジェクトを作成し、
// 以下の設定値を取得して入力してください。

const firebaseConfig = {
  // TODO: 以下の値をFirebase Consoleから取得して設定してください
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com/",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebaseが設定されていない場合は、localStorageのみを使用します
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

