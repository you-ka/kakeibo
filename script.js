function addItem() {
    const memo = document.getElementById("memo").value;
    const amount = document.getElementById("amount").value;
  
    if (memo === "" || amount === "") {
      alert("内容と金額を入力してね");
      return;
    }
  
    const list = document.getElementById("list");
    const li = document.createElement("li");
    li.textContent = `${memo}：¥${amount}`;
  
    list.appendChild(li);
  
    document.getElementById("memo").value = "";
    document.getElementById("amount").value = "";
  }
  