const http = require("http");
const url = require("url");
const fs = require("fs");
const db = require("./db").db;
const history = require("./history").history;

const server = http.createServer().listen(5000);
console.log("http://localhost:5000/api/db");

server.on("request", (req, res) => {
  const path = url.parse(req.url).pathname;

  if (path == "/") {
    fs.readFile("05-01.html", (err, data) => {
      if (err) {
        console.log(err.message);
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (path == "/api/db") {
    db.emit(req.method, req, res);
    history.emit("Request");
  } else if (path == "/api/ss" && req.method == "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        start: formatDate(history.startTime),
        end: formatDate(history.endTime),
        request: history.req,
        commit: history.commits,
      })
    );
  }
});

let sdHandler = null;
let scHandler = null;
let ssHandler = null;

process.stdin.setEncoding("utf-8");
process.stdin.on("readable", () => {
  let chunk = null;
  while ((chunk = process.stdin.read()) != null) {
    if (chunk.includes("sd")) {
      sdHandler = sd(chunk, sdHandler);
    } else if (chunk.includes("sc")) {
      scHandler = sc(chunk, scHandler);
    } else if (chunk.includes("ss")) {
      ssHandler = ss(chunk, ssHandler);
    }
  }
});

function sd(command, handler) {
  const commandsParts = command.split(" ");
  if (commandsParts.length == 1 && handler != null) {
    clearTimeout(handler);
    return null;
  } else if (Number.parseInt(commandsParts[1]) != NaN) {
    const time = Number.parseInt(commandsParts[1]) * 1000;
    if (handler != null) {
      clearTimeout(handler);
    }
    return setTimeout(() => {
      server.close();
      process.exit(0);
    }, time);
  }
}

function sc(command, handler) {
  const commandsParts = command.split(" ");
  if (commandsParts.length == 1 && handler != null) {
    clearInterval(handler);
    return null;
  } else if (Number.parseInt(commandsParts[1]) != NaN) {
    const interval = Number.parseInt(commandsParts[1]) * 1000;
    if (handler != null) {
      clearInterval(handler);
    }

    const intervalHandler = setInterval(() => {
      db.emit("COMMIT");
      history.emit("Commit");
    }, interval);

    intervalHandler.unref();
    return intervalHandler;
  }
}

function ss(command, handler) {
  const commandsParts = command.split(" ");
  if (commandsParts.length == 1 && handler != null) {
    clearTimeout(handler);
    history.emit("End");
  } else if (Number.parseInt(commandsParts[1]) != NaN) {
    const time = Number.parseInt(commandsParts[1]) * 1000;
    history.emit("Start");
    const timeout = setTimeout(() => {
      if (handler != null) clearTimeout(handler);
      history.emit("End");
    }, time);
    timeout.unref();
    return timeout;
  }
}

function formatDate(date) {
  return date != null
    ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    : "";
}
