const form = document.getElementById("form");
const list = document.getElementById("list");
const exportBtn = document.getElementById("export-btn");
const importBtn = document.getElementById("import-btn");
const importFile = document.getElementById("import-file");

let records = JSON.parse(localStorage.getItem("kakeibo")) || [];

function render() {
  list.innerHTML = "";

  records.forEach((r, i) => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = `${r.date} ${r.item} ¥${r.amount}`;

    const btn = document.createElement("button");
    btn.textContent = "削除";
    btn.onclick = () => {
      records.splice(i, 1); // ← 配列から削除
      localStorage.setItem("kakeibo", JSON.stringify(records));
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

  localStorage.setItem("kakeibo", JSON.stringify(records));

  form.reset();
  render();
});

// エクスポート機能
exportBtn.addEventListener("click", () => {
  const dataStr = JSON.stringify(records, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `kakeibo-${new Date().toISOString().split("T")[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
});

// インポート機能
importBtn.addEventListener("click", () => {
  importFile.click();
});

importFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const importedData = JSON.parse(event.target.result);
      
      if (!Array.isArray(importedData)) {
        alert("無効なデータ形式です。");
        return;
      }

      // 既存のデータとマージ（重複を避けるため、日付・内容・金額の組み合わせでチェック）
      const existingKeys = new Set(
        records.map(r => `${r.date}|${r.item}|${r.amount}`)
      );

      let addedCount = 0;
      importedData.forEach(item => {
        const key = `${item.date}|${item.item}|${item.amount}`;
        if (!existingKeys.has(key)) {
          records.push(item);
          existingKeys.add(key);
          addedCount++;
        }
      });

      // 日付でソート
      records.sort((a, b) => new Date(a.date) - new Date(b.date));

      localStorage.setItem("kakeibo", JSON.stringify(records));
      render();

      if (addedCount > 0) {
        alert(`${addedCount}件のデータを追加しました。`);
      } else {
        alert("新しいデータはありませんでした。");
      }
    } catch (error) {
      alert("ファイルの読み込みに失敗しました。");
      console.error(error);
    }
  };
  reader.readAsText(file);
  e.target.value = ""; // 同じファイルを再度選択できるようにリセット
});

render();

  