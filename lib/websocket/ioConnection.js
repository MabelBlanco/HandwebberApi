const server = require("../../bin/www");
const io = server.serverio;

io.on("connection", (socket) => {
  console.log("a user connected");
});
