const http = require("http");
const fs = require("fs");

const bound = "divider";
let body = `--${bound}\r\n`;
body += 'Content-Disposition:form-data; name="file"; Filename="myFile.txt"\r\n';
body += "Content-Type:text/plain\r\n\r\n";
body += fs.readFileSync("myFile.txt");
body += `\r\n--${bound}--\r\n`;

const options = {
  host: "localhost",
  port: "5000",
  path: "/task6",
  method: "POST",
  headers: { "Content-Type": `multipart/form-data; boundary=${bound}` },
};

const req = http.request(options);
req.end(body);
