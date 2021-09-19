const http = require("http");

const server = http.createServer().listen(3030);

server.on("request", (request, response) => {
  const reqInfo = `<h4>Method: ${request.method},</br> Url: ${
    request.url
  }, <br/> Protocol version: ${
    request.httpVersion
  }</br> Headers:</br> ${JSON.stringify(request.headers)}</h4>`;
  response.writeHead(200, { "Content-Type": "text/html" });
  response.end(reqInfo);
});
