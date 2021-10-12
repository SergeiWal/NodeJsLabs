const http = require("http");
const ws = require("ws");
const fs = require("fs");
const url = require("url");

const httpServer = http.createServer((req, res) => {
  const path = url.parse(req.url).pathname;
  if (path === "/start" && req.method === "GET") {
    fs.readFile("10-01.html", (err, data) => {
      if (err) {
        console.log(err.message);
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end("<h1>Error 400</h1>");
  }
});

let k = 0;
const socketServer = new ws.Server({
  port: 4000,
  path: "/",
  host: "localhost",
});
console.log("WS-server is started, port:4000");

socketServer.on("connection", (socket) => {
  let n = 0;
  setInterval(() => {
    ++k;
    socket.send(`10-01 Server: ${n}->${k}`);
  }, 5000);
  socket.on("message", (message) => {
    console.log(message.toString());
    n = Number.parseInt(message.toString().split(":")[1]);
    console.log("n:", n);
  });
  socket.on("close", () => {
    console.log("close connection");
  });
});

socketServer.on("close", () => {
  console.log("Connection is closed");
});

socketServer.on("error", function (err) {
  if (err.code == "EADDRINUSE") {
    console.error("Address in use, retrying...");
    setTimeout(() => {
      socketServer.close();
      socketServer.listen(4000);
    }, 1000);
  } else {
    console.error(err);
  }
});

httpServer.listen(3000, () => {
  console.log("Http-server is started, port:3000");
});
