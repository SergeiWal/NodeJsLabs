const http = require("http");
const stat = require("./app/filemanager")("./static");

const http_handler = (req, res) => {
  if (stat.isStatic("html", req.url)) {
    stat.sendFile(req, res, { "Content-Type": "text/html; charset=utf-8" });
  } else if (stat.isStatic("css", req.url)) {
    stat.sendFile(req, res, { "Content-Type": "text/css; charset=utf-8" });
  } else if (stat.isStatic("js", req.url)) {
    stat.sendFile(req, res, {
      "Content-Type": "text/javascript; charset=utf-8",
    });
  } else if (stat.isStatic("png", req.url)) {
    stat.sendFile(req, res, { "Content-Type": "image/png;" });
  } else if (stat.isStatic("docx", req.url)) {
    stat.sendFile(req, res, { "Content-Type": "application/msword;" });
  } else if (stat.isStatic("json", req.url)) {
    stat.sendFile(req, res, { "Content-Type": "application/json;" });
  } else if (stat.isStatic("xml", req.url)) {
    stat.sendFile(req, res, { "Content-Type": "application/xml;" });
  } else if (stat.isStatic("mp4", req.url)) {
    stat.sendFile(req, res, { "Content-Type": "video/mp4;" });
  } else stat.writeHTTP404(res);
};

const server = http.createServer();
server
  .listen(5000, () => {
    console.log(
      "Server has started listening: http://localhost:5000/index.html"
    );
  })
  .on("error", (err) => {
    console.log("Server: error : ", err.code);
  })
  .on("request", (req, res) => {
    if (req.method === "GET") {
      http_handler(req, res);
    } else {
      stat.writeHTTP405(res);
    }
  });
