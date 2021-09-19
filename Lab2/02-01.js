const http = require("http");
const fs = require("fs");
const url = require("url");

const server = http.createServer().listen(5000);

server.on("request", (req, res) => {
  const path = url.parse(req.url).pathname;

  if (path == "/html") {
    getTemplateAndSend("index.html", res);
  } else if (path == "/png") {
    res.writeHead(200, { "Content-Type": "image/jpeg" });
    getTemplateAndSend("pic.png", res);
  } else if (path == "/api/name") {
    res.writeHead(200, { "Content-Type": "text/plain", charset: "utf-8" });
    res.end("Valko Sergei Alexandrovitch");
  } else if (path == "/xmlhttprequest") {
    getTemplateAndSend("xmlhttprequest.html", res);
  } else if (path == "/fetch") {
    getTemplateAndSend("fetch.html", res);
  } else if (path == "/jquery") {
    getTemplateAndSend("jquery.html", res);
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`${path}`);
  }
});

function getTemplateAndSend(path, response) {
  fs.readFile(path, (err, data) => {
    if (err) {
      console.error(err);
    }

    response.end(data);
  });
}
