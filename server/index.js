require("dotenv").config(); // Add this line at the top

const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const Message = require("./models/message");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const userRouter = require("./routes/userRoute");
const contactRoute = require("./routes/contactRoute");
const { Server } = require("socket.io");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const messageRoute = require("./routes/messageRoute");

const app = express();
const PORT =  8000; // Use the PORT from .env or default to 8000

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://siraj2024ansarib:e321e321@cluster0.scfo9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0") // Use the MONGO_URI from .env
  .then(() => console.log("MongoDB Connected."))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.resolve("./public")));
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.join(__dirname, 'dist')));
console.log("dirname: ",__dirname);
app.use(
  cors({
    origin: "http://localhost:5173", // Use the FRONTEND_URL from .env
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Use the FRONTEND_URL from .env
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("join-room", async (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);

    // Fetch previous messages for this room
    const messages = await Message.find({ room })
      .sort({ _id: 1 })
      .populate("replyTo")
      .exec();
    socket.emit("load-messages", messages);
  });

  socket.on("send-msg", async (data) => {
    console.log("message is sending");
    const newMessage = new Message(data);
    await newMessage.save(); // Save message to database

    socket.to(data.room).emit("recieve-msg", data); // Send to other users in the room
    console.log("Message sent:", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

io.on("connect_error", (err) => {
  console.error("Socket.io connection error:", err);
});

// Routes
app.use("/user", userRouter);
app.use("/contact", contactRoute);
app.use("/message", messageRoute);

// For unknown routes, serve the index.html file (SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT, () => console.log("server started at port: ", PORT));

module.exports = { Message };