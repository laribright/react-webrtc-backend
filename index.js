const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(cors());

// Basic home endpoint 
app.get("/", (req, res, next) => {
  res.send("server is running");
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id); // ID

  socket.on("disconnect", () => {
    socket.broadcast.emit("callended"); //EndCall
  });

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  }); // Call User

  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", data.signal);
  }); //Answer call
}); 

// No .env file. Just keeping it simple
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
