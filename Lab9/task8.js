const http = require("http");
const fs = require("fs");

const options = {
  host: "localhost",
  port: "5000",
  path: "/task8",
  method: "GET",
};

const req = http.request(options, (res) => {
  res.pipe(fs.createWriteStream("newFile.txt"));
});
req.end();
