const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");
const xmlbuilder = require("xmlbuilder");
const parseString = require("xml2js").parseString;
const multiparty = require("multiparty");

const get_handler = (req, res) => {
  const path = url.parse(req.url, true).pathname;
  if (path === "/task1") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Task 1 response");
  } else if (path === "/task2") {
    const q = url.parse(req.url, true).query;
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`x: ${q["x"]}, y: ${q["y"]}`);
  } else if (path === "/task8") {
    res.end(fs.readFileSync("myFile.txt"));
  }
};

const post_handler = (req, res) => {
  const path = url.parse(req.url, true).pathname;
  if (path === "/task3") {
    let body = "";
    req.on("data", (data) => {
      body += data;
    });

    req.on("end", () => {
      var q = querystring.parse(body);
      let result = `Response: x - ${q["x"]}, y - ${q["y"]}, s - ${q["s"]}`;
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(result);
    });
  } else if (path === "/task4") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      console.log(JSON.parse(data));
      const q = JSON.parse(data);
      let resJson = {};
      resJson["__comment"] = "Response";
      resJson["x_plus_y"] = Number.parseInt(q.x) + Number.parseInt(q.y);
      resJson["Concatination_s_o"] = `${q.s} ${q.o.surname}, ${q.o.name}`;
      resJson["Length_m"] = Array.isArray(q.m) ? q.m.length : 0;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(resJson));
    });
  } else if (path === "/task5") {
    let xmlstring = "";
    req.on("data", (data) => {
      xmlstring += data;
    });
    req.on("end", () => {
      let obj = null;
      parseString(xmlstring, (err, result) => {
        if (err) {
          console.log("File read error");
          res.writeHead(400, {});
          res.end("XML parse error");
          return;
        }
        const requestId = result.request.$.id;
        let sum = 0;
        let mess = "";
        result.request.x.forEach((item) => {
          sum += Number.parseInt(item.$.value);
        });
        result.request.m.forEach((item) => {
          mess += item.$.value;
        });
        let resXml = xmlbuilder
          .create("response")
          .att("id", Math.round(Math.random() * 50))
          .att("request", requestId);
        resXml.ele("sum", { element: "x", sum: `${sum}` });
        resXml.ele("concat", { element: "m", result: `${mess}` });
        res.writeHead(200, { "Content-Type": "text/xml" });
        res.end(resXml.toString({ pretty: true }));
      });
    });
  } else if (path === "/task6" || path === "/task7") {
    let result = "";
    const form = new multiparty.Form({ uploadDir: "./static" });
    form.on("filed", (name, value) => {
      result += `<br/>---${name}=${value}`;
    });
    form.on("file", (name, file) => {
      result += `<br/>---${name}=${file.originalFilename}: ${file.path}`;
    });
    form.on("error", (err) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<h2>Form error</h2>");
    });
    form.on("close", () => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write("<h2>Form</h2>");
      res.end(result);
    });
    form.parse(req);
  }
};

const request_handler = (req, res) => {
  switch (req.method) {
    case "GET":
      get_handler(req, res);
      break;
    case "POST":
      post_handler(req, res);
      break;
    default:
      break;
  }
};

const server = http.createServer();
server.on("request", request_handler);
server.listen(5000);
