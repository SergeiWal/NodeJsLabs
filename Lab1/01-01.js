const http = require('http');

const server = http.createServer().listen(3030);

server.on('request', (request, response)=>{
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(`<h1>Hello world!!!</h1>`);
});
