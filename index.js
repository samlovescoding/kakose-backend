require("dotenv").config();
const http = require("http");
const app = require("./app");
const port = process.env.PORT || 4000;

console.log("Server started on port " + port);
const server = http.createServer(app);

server.listen(port);
