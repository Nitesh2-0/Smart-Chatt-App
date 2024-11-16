const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/userModel');
const socket = require('socket.io');
const userRoute = require('./routes/userRoute');
const messageRoute = require('./routes/messageRouter');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/api/auth', userRoute);
app.use('/api/messages', messageRoute);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB connected successfully.'))
  .catch((err) => console.error('DB connection error:', err));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = socket(server, {
  cors: {
    origin: process.env.CROSS_ORIGIN,
    credentials: true,
  }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  // Handle user going online
  socket.on("add-user", async (userId) => {
    onlineUsers.set(userId, socket.id);
    await User.findByIdAndUpdate(userId, { status: 'online' });

    // Broadcast the user's online status to all connected clients
    io.emit("user-online", userId);
    console.log(`User ${userId} is online`);
  });

  // Handle sending messages
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.msg);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", async () => {
    const userId = [...onlineUsers.entries()].find(([key, value]) => value === socket.id)?.[0];
    
    if (userId) {
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { status: 'offline' });

      // Broadcast the user's offline status to all connected clients
      io.emit("user-offline", userId);
      // console.log(`User ${userId} is offline`);
    }
    
    // console.log("disconnected");
  });
});
