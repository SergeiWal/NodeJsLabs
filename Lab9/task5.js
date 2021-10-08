const http = require("http");
const parseString = require("xml2js").parseString;
const xmlbuilder = require("xmlbuilder");
const xmldoc = xmlbuilder.create("request").att("id", 33);
xmldoc.element("x").att("value", 1);
xmldoc.element("x").att("value", 2);
xmldoc.element("x").att("value", 3);
xmldoc.element("m").att("value", "a");
xmldoc.element("m").att("value", "b");
xmldoc.element("m").att("value", "c");

const options = {
  host: "localhost",
  port: "5000",
  path: "/task5",
  method: "POST",
  headers: { "Content-Type": "applicatiom/xml", accept: "application/xml" },
};

const req = http.request(options, (res) => {
  console.log("Response status code: ", res.statusCode);
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    parseString(data, (err, result) => {
      if (err) {
        console.log("File read error");
        res.writeHead(400, {});
        res.end("XML parse error");
        return;
      }
      console.log("REsponse id:", result.response.$.id);
      console.log("REquest id:", result.response.$.request);
      result.response.sum.forEach((item) => {
        console.log(`Sum element=${item.$.element} result=${item.$.sum}`);
      });
      result.response.concat.forEach((item) => {
        console.log(`Concat element=${item.$.element} result=${item.$.result}`);
      });
    });
  });
});

req.write(xmldoc.toString({ pretty: true }));
req.end();
