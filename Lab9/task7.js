const http = require("http");
const fs = require("fs");

const bound = "divider";
let body = `--${bound}\r\n`;
body += 'Content-Disposition:form-data; name="file"; Filename="pic.png"\r\n';
body += "Content-Type:application/octet-stream\r\n\r\n";

const options = {
  host: "localhost",
  port: "5000",
  path: "/task7",
  method: "POST",
  headers: { "Content-Type": `multipart/form-data; boundary=${bound}` },
};

const req = http.request(options);
req.write(body);
let stream = new fs.ReadStream("pic.png");
stream.on("data", (chunk) => {
  req.write(chunk);
});

stream.on("end", () => {
  req.end(`\r\n--${bound}--\r\n`);
});
