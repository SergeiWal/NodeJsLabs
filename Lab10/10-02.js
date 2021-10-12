const ws = require("ws");

const webSocket = new ws.WebSocket("ws://localhost:4000/");

let n = 0;
let handler;
webSocket.on("open", () => {
  handler = setInterval(() => {
    webSocket.send(`10-02-client: ${++n}`);
  }, 3000);
});

webSocket.on("close", () => {
  console.log("Connection is closed");
});

webSocket.on("message", (message) => {
  console.log(message.toString());
});

setTimeout(() => {
  if (handler) {
    clearInterval(handler);
  }
  webSocket.close();
}, 25000);
