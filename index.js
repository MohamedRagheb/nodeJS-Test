const fileSystemControl = require("fs");
const http = require("http");
const { connected } = require("process");
const ip = "127.0.0.1";
const port = "5500";
let fileFetchinghanedelar = fileSystemControl.readFileSync("fr.json");
let data = JSON.parse(fileFetchinghanedelar);
function createObjecttoSend(daraAsBuffer, to) {
  // check if one input ore more
  let final = {};
  let check = daraAsBuffer.split("&");
  check.forEach((el) => {
    //  convert input data to object
    let splitedInput = el.split("=");
    let key = splitedInput[0];
    const value = splitedInput[1];
    Object.assign(final, { [key]: value });
  });
  // add created obj To full Data
  to.push(final);
}
function writeInFileHandelar(what, where) {
  // handel data to JSON
  let Data = JSON.stringify(what);
  fileSystemControl.writeFileSync(where, Data);
}
function presentData(data) {
  let ul = "<ul>";

  data.forEach((item) => {
    ul += `<li class="li">${item.name}: ${item.num}</li>`;
  });

  ul += "</ul>";

  return ul;
}
const server = http.createServer((req, res) => {
  let body = [];

  const url = req.url;
  console.log(url);
  res.setHeader("Content-Type", "text/html");
  switch (url) {
    case "/index.html/":
      res.write("<html>");
      res.write("<body>");
      res.write(`
                <form action="/index.html/Add" method="post">
                <input type="text" placeholder="New Frined name" name="name" />
                <input type="number" placeholder="New Frined number" name="num" />
                <input type="submit" value="Add"/>
                </form>
          `);
      let list = presentData(data);
      res.write(list);
      res.write("<body>");
      res.write("</html>");
      break;
    case "/index.html/Add":
      req.on("data", (data) => body.push(data));
      req.on("end", () => {
        body = Buffer.concat(body).toString();
        createObjecttoSend(body, data);
        writeInFileHandelar(data, "fr.json");
      });
      res.writeHead(302, { Location: "/index.html/" });
      break;
  }
  res.end();
});
server.listen(port, ip, () => {
  console.log("code runed in http://localhost:3000");
});
