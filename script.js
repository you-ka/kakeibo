const form = document.getElementById("form");
const list = document.getElementById("list");
const syncStatus = document.getElementById("sync-status");

let records = JSON.parse(localStorage.getItem("kakeibo")) || [];
let isSyncing = false;
let firebaseRef = null;

function updateSyncStatus(status, message) {
  syncStatus.innerHTML = `<div class="sync-status ${status}">${message}</div>`;
}

function saveRecords() {
  localStorage.setItem("kakeibo", JSON.stringify(records));
  
  // Firebaseに保存（設定されている場合）
  if (firebaseRef && !isSyncing) {
    isSyncing = true;
    updateSyncStatus("syncing", "同期中...");
    firebase.database().ref(firebaseRef).set(records)
      .then(() => {
        updateSyncStatus("synced", "✓ 同期済み");
        setTimeout(() => {
          if (syncStatus.innerHTML.includes("同期済み")) {
            syncStatus.innerHTML = "";
          }
        }, 2000);
      })
      .catch((error) => {
        updateSyncStatus("error", "✗ 同期エラー");
        console.error("Firebase同期エラー:", error);
      })
      .finally(() => {
        isSyncing = false;
      });
  }
}

function mergeRecords(newRecords) {
  const existingKeys = new Set(
    records.map(r => `${r.date}|${r.item}|${r.amount}`)
  );

  let addedCount = 0;
  newRecords.forEach(item => {
    const key = `${item.date}|${item.item}|${item.amount}`;
    if (!existingKeys.has(key)) {
      records.push(item);
      existingKeys.add(key);
      addedCount++;
    }
  });

  if (addedCount > 0) {
    records.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveRecords();
    render();
    return addedCount;
  }
  return 0;
}

function render() {
  list.innerHTML = "";

  records.forEach((r, i) => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = `${r.date} ${r.item} ¥${r.amount}`;

    const btn = document.createElement("button");
    btn.textContent = "削除";
    btn.onclick = () => {
      records.splice(i, 1);
      saveRecords();
      render();
    };

    li.appendChild(text);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const date = form.date.value;
  const item = form.item.value;
  const amount = form.amount.value;

  records.push({ date, item, amount });
  saveRecords();

  form.reset();
  render();
});

// Firebase自動同期の初期化
function initFirebaseSync() {
  if (typeof firebaseConfig !== 'undefined' && typeof isFirebaseConfigured !== 'undefined' && isFirebaseConfigured) {
    try {
      let app;
      try {
        app = firebase.app();
      } catch (e) {
        app = firebase.initializeApp(firebaseConfig);
      }
      const database = firebase.database();
      firebaseRef = "kakeibo/records";
      
      // 既存のローカルデータをFirebaseにアップロード
      if (records.length > 0) {
        database.ref(firebaseRef).once('value', (snapshot) => {
          const cloudData = snapshot.val();
          if (cloudData && Array.isArray(cloudData)) {
            // クラウドデータとローカルデータをマージ
            const localAdded = mergeRecords(cloudData);
            if (localAdded === 0) {
              // ローカルデータをクラウドにアップロード
              saveRecords();
            }
          } else {
            // クラウドにデータがない場合はローカルデータをアップロード
            saveRecords();
          }
        });
      }
      
      // リアルタイム同期：他の端末からの変更を監視
      database.ref(firebaseRef).on('value', (snapshot) => {
        if (isSyncing) return; // 自分が更新中は無視
        
        const cloudData = snapshot.val();
        if (cloudData && Array.isArray(cloudData)) {
          const addedCount = mergeRecords(cloudData);
          if (addedCount > 0) {
            updateSyncStatus("synced", `✓ ${addedCount}件のデータを同期しました`);
            setTimeout(() => {
              if (syncStatus.innerHTML.includes("同期しました")) {
                syncStatus.innerHTML = "";
              }
            }, 3000);
          }
        }
      });
      
      updateSyncStatus("synced", "✓ 自動同期が有効です");
      setTimeout(() => {
        if (syncStatus.innerHTML.includes("自動同期が有効です")) {
          syncStatus.innerHTML = "";
        }
      }, 3000);
    } catch (error) {
      console.error("Firebase初期化エラー:", error);
      updateSyncStatus("error", "✗ 自動同期の設定に問題があります");
    }
  } else {
    updateSyncStatus("local", "ローカルモード（自動同期未設定）");
    setTimeout(() => {
      if (syncStatus.innerHTML.includes("ローカルモード")) {
        syncStatus.innerHTML = "";
      }
    }, 3000);
  }
}

// Firebase SDKの読み込みを待つ
if (typeof firebase !== 'undefined') {
  initFirebaseSync();
} else {
  // Firebase SDKがまだ読み込まれていない場合
  window.addEventListener('load', () => {
    setTimeout(() => {
      initFirebaseSync();
    }, 500);
  });
}

render();

  