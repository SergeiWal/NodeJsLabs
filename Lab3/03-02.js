const http = require("http");
const url = require("url");
const fs = require("fs");

const server = http.createServer().listen(5000);

server.on("request", (req, res) => {
  const path = url.parse(req.url).pathname;
  const query = url.parse(req.url, true).query;

  if (path == "/") {
    fs.readFile("03-02.html", (err, data) => {
      if (err) {
        console.log(err.message);
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (path == "/fact" && req.method == "GET") {
    const value = query.k;
    if (value != "undefined") {
      const result = factarial(value);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ k: value, fact: result }));
    }
  }
});

function factarial(number) {
  return number <= 2 ? number : number * factarial(number - 1);
}
