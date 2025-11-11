// socket/chatHandler.js
const { Server } = require("socket.io");
const Message = require("../models/Message");

async function initSocket(server) {  
  const io = new Server(server, {
    cors: {
      origin: "*", // ⚠️ DEV only
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔗 New client connected:", socket.id);

    // 🏠 Khi join phòng
    socket.on("join_room", async ({ roomId, user }) => {
      socket.join(roomId);
      socket.data.user = user;
      socket.data.roomId = roomId;

      // 📜 Gửi lịch sử tin nhắn từ MongoDB (mới nhất 100 tin)
      const history = await Message.find({ roomId })
        .sort({ time: 1 })
        .limit(100)
        .lean();
      socket.emit("room_history", history);

      // 📢 Gửi thông báo System
      const joinMsg = new Message({
        roomId,
        user: "System",
        text: `${user} đã vào phòng.`,
      });
      await joinMsg.save();

      io.to(roomId).emit("receive_message", joinMsg);
    });

    // 💬 Khi gửi tin nhắn
    socket.on("send_message", async (payload) => {
      const { roomId, user, text, image } = payload;

      const msg = new Message({
        roomId,
        user,
        text: text || "",
        image: image || null,
      });
      await msg.save();

      io.to(roomId).emit("receive_message", msg);
    });

    // ❌ Khi rời phòng / mất kết nối
    socket.on("disconnect", async () => {
      const { roomId, user } = socket.data || {};
      if (roomId && user) {
        const leaveMsg = new Message({
          roomId,
          user: "System",
          text: `${user} đã rời phòng.`,
        });
        await leaveMsg.save();

        io.to(roomId).emit("receive_message", leaveMsg);
      }
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io;
}

module.exports = { initSocket };
