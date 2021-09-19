const http = require("http");
const url = require("url");
const readline = require("readline");

const inOut = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const state = {
  states: ["norm", "stop", "test", "idle", "exit"],
  current: "norm",
};

const server = http.createServer().listen(5000);
console.log("Server is started http://localhost:5000/");

server.on("request", (req, res) => {
  const path = url.parse(req.url).pathname;

  if (path == "/" && req.method == "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<h3>${state.current}</h3>`);
  }
});

consoleListening();

function prompt(answer) {
  answer = answer.toLowerCase();

  if (answer == "exit") {
    inOut.close();
    server.close();
    process.exit();
    return;
  }

  if (testAnswer(answer)) {
    console.log(`req = ${state.current} --> ${answer}`);
    state.current = answer;
  }

  consoleListening();
}

function consoleListening() {
  inOut.question(`${state.current}->`, (answer) => {
    prompt(answer);
  });
}

function testAnswer(answer) {
  return (
    answer != null &&
    state.states.findIndex((command) => answer == command) != -1
  );
}
