const http = require("http");
const url = require("url");
const fs = require("fs");
const qs = require("querystring");
const parseString = require("xml2js").parseString;
const xmlbuilder = require("xmlbuilder");
const mp = require("multiparty");

const http_router = (req, res) => {
  const p = url.parse(req.url, true);
  switch (p.pathname) {
    case "/connection":
      connection(req, res);
      break;
    case "/headers":
      headers(req, res);
      break;
    case "/parameter":
      parameter(req, res);
      break;
    case "/close":
      close(req, res);
      break;
    case "/socket":
      socket(req, res);
      break;
    case "/req-data":
      reqData(req, res);
      break;
    case "/resp-status":
      respStatus(req, res);
      break;
    case "/formparameter":
      formParam(req, res);
      break;
    case "/json":
      jsonPost(req, res);
      break;
    case "/xml":
      xmlPost(req, res);
      break;
    case "/files":
      filesPost(req, res);
      break;
    case "/upload":
      uploadFie(req, res);
      break;
    default:
      break;
  }
};

const uploadFie = (req, res) => {
  if (req.method === "GET") {
    fs.readFile("upload.html", (err, data) => {
      if (err) {
        res.writeHead(404, {});
        res.end("File not found");
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (req.method === "POST") {
    let result = "";
    const form = new mp.Form({ uploadDir: "./static" });
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

const filesPost = (req, res) => {
  if (req.method === "GET") {
    fs.readdir("./static", (err, files) => {
      if (err) {
        res.writeHead(400, {});
        res.end("Directory has not found");
      }

      res.setHeader("X-static-files-count", `${files.length}`);
      res.end();
    });
  }
};

const xmlPost = (req, res) => {
  if (req.method === "POST") {
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
  }
};

const jsonPost = (req, res) => {
  if (req.method === "POST") {
    let result = "";
    req.on("data", (data) => {
      result += data;
    });
    req.on("end", () => {
      const q = JSON.parse(result);
      let resJson = {};
      resJson["__comment"] = "Ответ.Лабараторная работа 8.10";
      resJson["x_plus_y"] = Number.parseInt(q.x) + Number.parseInt(q.y);
      resJson["Concatination_s_o"] = `${q.s} ${q.o.surname}, ${q.o.name}`;
      resJson["Length_m"] = Array.isArray(q.m) ? q.m.length : 0;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(resJson));
    });
  }
};

const formParam = (req, res) => {
  if (req.method === "GET") {
    fs.readFile("formparam.html", (err, data) => {
      if (err) {
        console.log("File read error");
        res.writeHead(400, {});
        res.end("File read error");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (req.method === "POST") {
    let result = "";
    req.on("data", (data) => {
      result += data;
    });
    req.on("end", () => {
      result += "<br>";
      const q = qs.parse(result);
      for (let key in q) {
        result += `${key} = ${q[key]}<br/>`;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.write("<h1>URL параметры</h1>");
      res.end(result);
    });
  }
};

const respStatus = (req, res) => {
  if (req.method === "GET") {
    const q = url.parse(req.url, true).query;
    if (
      q["code"] != undefined &&
      q["mess"] != undefined &&
      Number.parseInt(q["code"])
    ) {
      const code = Number.parseInt(q["code"]);
      const message = q["mess"];
      res.statusCode = code;
      res.statusMessage = message;
      res.end(`${code} : ${message}`);
    }
  }
};

const reqData = (req, res) => {
  if (req.method === "GET" || req.method === "POST") {
    req.on("data", (data) => {
      console.log("---------data chunk----------", data);
    });

    req.on("end", () => {
      res.end("end");
    });
  }
};

const socket = (req, res) => {
  if (req.method === "GET") {
    const ip = req.socket.remoteAddress;
    const port = req.socket.remotePort;
    const serverPort = res.socket.remotePort;
    const serverAddr = res.socket.remoteAddress;
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      `Clent:<br/>IP:${ip}<br/>Port:${port}<br/>Server${serverAddr}:<br/>Port:${serverPort}<br/>`
    );
  }
};

const close = (req, res) => {
  if (req.method === "GET") {
    setTimeout(() => {
      server.close();
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("Server is closed");
    }, 10000);
  }
};

const filesV2 = (req, res) => {
  const p = url.parse(req.url, true);
  if (
    p.pathname.indexOf("/files") >= 0 &&
    req.method === "GET" &&
    p.pathname.split("/").length > 2
  ) {
    const filename = p.pathname.split("/")[2];
    fs.readFile(`./static/${filename}`, (err, data) => {
      if (err) {
        res.writeHead(404, {});
        res.end("File not found");
      }
      res.writeHead(200, { "Content-Type": "multipart/form-data" });
      res.end(data);
    });
  }
};

const parameterV2 = (req, res) => {
  const p = url.parse(req.url, true);
  const q = url.parse(req.url, true).query;
  if (
    p.pathname.indexOf("/parameter") >= 0 &&
    req.method === "GET" &&
    Object.keys(q).length == 0
  ) {
    let x, y;
    p.pathname.split("/").forEach((value, index) => {
      const v = Number.parseInt(value);
      if (v) {
        if (index == 2) x = v;
        if (index == 3) y = v;
      }
    });
    if (x && y) {
      let result = `x+y= ${x + y} <br/>
      x-y= ${x - y} <br/> x*y= ${x * y} <br/>
      x/y= &{x/y}<br/>`;
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(result);
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`<h3>${req.url}</h3>`);
    }
  }
};

const connection = (req, res) => {
  if (req.method === "GET") {
    const q = url.parse(req.url, true).query;
    if (q["set"] != undefined) {
      server.keepAliveTimeout = Number.parseInt(q["set"]);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        `<h3>New value KeepAliveTimeout = ${server.keepAliveTimeout}</h3>`
      );
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`<h3>KeepAliveTimeout = ${server.keepAliveTimeout}</h3>`);
    }
  }
};

const headers = (req, res) => {
  if (req.method === "GET") {
    let result = "Request headers: <br/>";
    for (key in req.headers) {
      result += `${key} : ${req.headers[key]}<br/>`;
    }
    result += " Response headers: <br/>";
    res.setHeader("Content-Type", "text/html");
    const resHeaders = res.getHeaders();
    for (key in resHeaders) {
      result += `${key} : ${resHeaders[key]}<br/>`;
    }
    res.writeHead(200);
    res.end(result);
  }
};

const parameter = (req, res) => {
  if (req.method === "GET") {
    const q = url.parse(req.url, true).query;
    if (
      q["x"] != undefined &&
      Number.parseInt(q["x"]) &&
      q["y"] != undefined &&
      Number.parseInt(q["y"])
    ) {
      const x = Number.parseInt(q["x"]);
      const y = Number.parseInt(q["y"]);
      let result = `x+y= ${x + y} <br/>
      x-y= ${x - y} <br/> x*y= ${x * y} <br/>
      x/y= &{x/y}<br/>`;
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(result);
    } else {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end("Error, novalid params");
    }
  }
};

const server = http.createServer();
server.listen(5000, () => {
  console.log("Server is started on http://localhost:5000");
});
server.on("request", filesV2);
server.on("request", http_router);
server.on("request", parameterV2);
