const io = require("socket.io")(3000);

const users = {};
var userList = [];
var userToRemove = "";

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    if (name == null || name == "") name = "anonymous";
    users[socket.id] = name;
    userList.push(name);
    //These are ran for the client joining
    socket.emit("user-profile", name);
    socket.emit("online-users-list", userList);
    //Broadcasted to everyone
    socket.broadcast.emit("user-connected", name);
    socket.broadcast.emit("online-users-list", userList);
  });
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    userToRemove = users[socket.id.toString()];
    delete users[socket.id];
    userList = userList.filter((item) => item !== userToRemove);
    socket.broadcast.emit("online-users-list", userList);
    userToRemove = "";
  });
});
