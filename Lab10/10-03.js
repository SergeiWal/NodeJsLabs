const ws = require("ws");

const server = new ws.WebSocketServer({ port: 4000 });

server.on("connection", (socket) => {
  socket.on("message", (data) => {
    server.clients.forEach((client) => {
      if (client.readyState === ws.WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});

console.log("Broadcast server is working, port: 4000");
