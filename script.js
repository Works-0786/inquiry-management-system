let tickets = [];

const registerButton = document.getElementById("registerButton");

const statusFilter =document.getElementById("statusFilter");

registerButton.addEventListener("click", addTicket);

statusFilter.addEventListener("change", filterTickets);

// 問い合わせ登録
function addTicket(event) {
 event.preventDefault();
 const title = document.getElementById("incidentTitle").value;
 const detail = document.getElementById("incidentDetail").value;
 const category = document.getElementById("category").value;
 const priority = document.getElementById("priority").value;


if (title === "") {
 alert("件名を入力してください");
 return;
}

const today = new Date();

const createdAt =
  `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

const ticket = {
 id: Date.now(),
 title: title,
 detail: detail,
 category: category,
 priority: priority,
 status: "受付中",
 createdAt: createdAt
};

tickets.push(ticket);
console.log(tickets);
localStorage.setItem("tickets", JSON.stringify(tickets));
renderTickets(tickets);

document.getElementById("incidentTitle").value = ""; 
document.getElementById("incidentDetail").value = "";
document.getElementById("category").value = "障害";
document.getElementById("priority").value = "低";
}

// 一覧表示
function renderTickets(ticketArray) {
 const incidentList =
  document.getElementById("incidentList");

 const ticketCount =
 document.getElementById("ticketCount");

 ticketCount.textContent =
  `一覧表示（${ticketArray.length}件）`;

 incidentList.innerHTML = "";

ticketArray.forEach(ticket => {

 let statusClass = "";

 if(ticket.status === "受付中") {
  statusClass = "status-open";
 } else if(ticket.status === "対応中") {
    statusClass = "status-progress";
 } else { 
    statusClass = "status-complete";
 }

 const row = `
   <tr>
    <td class="clickable" onclick="onClickTd(${ticket.id})">${ticket.title}</td>
    <td>${ticket.category}</td>
    <td >${ticket.priority}</td>
    <td class="${statusClass}">${ticket.status}</td>
    <td>${ticket.createdAt}</td>
   </tr>
  `;

 incidentList.innerHTML += row;
 });
}

// 状態絞り込み
function filterTickets() {
 const filteredStatus = statusFilter.value;

 if (filteredStatus === "all") {
  renderTickets(tickets);
  return;
 }

const filteredTickets = tickets.filter((ticket) => 
 ticket.status === filteredStatus);

 renderTickets(filteredTickets);
}

// 詳細表示
function onClickTd(id) {
 const foundTicket = tickets.find(ticket =>
 ticket.id === id); 

const detailModal =
 document.getElementById("detailModal");

 detailModal.innerHTML = `
 件名: ${foundTicket.title}<br>
 詳細: ${foundTicket.detail}<br>
 区分: ${foundTicket.category}<br>
 優先度: ${foundTicket.priority}<br>
 状態: 
<select id="statusChange">
  <option value="受付中">受付中</option>
  <option value="対応中">対応中</option>
  <option value="完了">完了</option>
</select>
 登録日: ${foundTicket.createdAt}<br>
 <button onclick="changeStatus(${foundTicket.id})">状態変更</button>
 <button onclick="deleteTicket(${foundTicket.id})">削除</button>
 <button onclick="closeModal()">閉じる</button>
 `;

 const statusSelect =
 document.getElementById("statusChange");

statusSelect.value = foundTicket.status;
}

// 問い合わせ削除
function deleteTicket(id) {
 const result =
  confirm("こちらの問い合わせを削除します。よろしいですか？");
 
if (result === false) {
 return;
}

tickets = tickets.filter((ticket) =>
 ticket.id !== id);

localStorage.setItem("tickets", JSON.stringify(tickets));
renderTickets(tickets);
closeModal();
}

// 状態変更
function changeStatus(id) {
 const statusChange =
 document.getElementById("statusChange").value;

 const targetTicket = tickets.find(ticket =>
 ticket.id === id);
 targetTicket.status = statusChange;

 localStorage.setItem("tickets", JSON.stringify(tickets));
 renderTickets(tickets);
}

// 詳細画面を閉じる
function closeModal() {
detailModal.innerHTML = "";
}

const savedTickets = localStorage.getItem("tickets");

if (savedTickets) {
 tickets = JSON.parse(savedTickets); 
}

renderTickets(tickets);