function Stat(dir = "./static") {
  this.STATIC_FOLDER = dir;
  this.pathStatic = (fn) => {
    return `${this.STATIC_FOLDER}${fn}`;
  };
  this.writeHTTP404 = (res) => {
    res.statusCode = 404;
    res.statusMessage = "Resource not found";
    res.end("Resource not found");
  };

  this.writeHTTP405 = (res) => {
    res.statusCode = 405;
    res.statusMessage = "Method Not Allowed";
    res.end("Method Not Allowed");
  };

  const fs = require("fs");
  this.pipeFile = (req, res, headers) => {
    res.writeHead(200, headers);
    fs.createReadStream(this.pathStatic(req.url)).pipe(res);
  };
  this.isStatic = (ext, fn) => {
    const req = new RegExp(`^\/.+\.${ext}$`);
    return req.test(fn);
  };
  this.sendFile = (req, res, headers) => {
    fs.access(this.pathStatic(req.url), fs.constants.R_OK, (err) => {
      if (err) {
        this.writeHTTP404(res);
      } else {
        this.pipeFile(req, res, headers);
      }
    });
  };
}

module.exports = (param) => new Stat(param);
