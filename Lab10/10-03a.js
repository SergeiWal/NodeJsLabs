const ws = require("ws");

const webSocket = new ws.WebSocket("ws://localhost:4000/");

webSocket.on("open", () => {
  webSocket.send(`Clients message`);
});

webSocket.on("close", () => {
  console.log("Connection is closed");
});

webSocket.on("message", (message) => {
  console.log(message.toString());
});
