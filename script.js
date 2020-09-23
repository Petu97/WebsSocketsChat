const socket = io("http://localhost:3000");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const userContainer = document.getElementById("user-container");
const profileContainer = document.getElementById("profile-container");

const name = prompt("What is your name?");
socket.emit("new-user", name);
appendMessage("You joined");

//display message
socket.on("chat-message", (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

//display profile
socket.on("user-profile", (userName) => {
  const profileElement = document.createElement("div");
  profileElement.innerText = userName.toString();
  profileContainer.append(profileElement);
});

//display message
socket.on("user-connected", (name) => {
  appendMessage(`${name} connected`);
});

//display message
socket.on("user-disconnected", (name) => {
  appendMessage(`${name} disconnected`);
});

//display online users
socket.on("online-users-list", (userList) => {
  appendUser(userList);
});

//send messages
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`);
  socket.emit("send-chat-message", message);
  messageInput.value = "";
});

//display message function
function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}

//display list of online users
function appendUser(userList) {
  document.getElementById("user-container").innerHTML = "<h3>Users Online</h3>";
  userList.forEach(ListUsers);
  function ListUsers(item, index) {
    const userElement = document.createElement("div");
    userElement.innerText = item;
    userContainer.append(userElement);
  }
}
