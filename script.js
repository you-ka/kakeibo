const form = document.getElementById("form");
const list = document.getElementById("list");

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

render();

  