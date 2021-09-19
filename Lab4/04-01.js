const http = require("http");
const url = require("url");
const fs = require("fs");
const db = require("./db").db;

const server = http.createServer().listen(5000);

server.on("request", (req, res) => {
  const path = url.parse(req.url).pathname;

  if (path == "/") {
    fs.readFile("04-02.html", (err, data) => {
      if (err) {
        console.log(err.message);
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (path == "/api/db") {
    db.emit(req.method, req, res);
  }
});

console.log("http://localhost:5000/api/db");
