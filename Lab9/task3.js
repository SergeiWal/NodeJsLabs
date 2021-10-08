const http = require("http");
const query = require("querystring");
const path = "/task3";
const options = {
  host: "localhost",
  port: "5000",
  path: path,
  method: "POST",
};

const req = http.request(options, (res) => {
  console.log("Response status code: ", res.statusCode);
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log("Data: ", data);
  });
});

req.end(query.stringify({ x: "Hello", y: "world", s: "!!!" }));
