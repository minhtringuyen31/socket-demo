import express from "express";
import { createServer } from "http";

// Import một số thư viện
// Thư viện để chuyển đổi URL thành đường dẫn trên hệ thồng tệp
import { fileURLToPath } from "url";
// dirname: trả về đường dẫn thư mục chưa tệp ti hiện tại
// join để kết hợp nhiều phần để tạo thành đường dẫn hoàn chỉnh
import { dirname, join } from "path";

import { Server } from "socket.io";

const app = express();
const server = createServer(app);

//Tạo Socket Server
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

//Viết API trang chatting
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("Client: ", socket.id, " connected");
  socket.on("disconnect", () => {
    console.log("Client: ", socket.id, " disconnected");
  });

  // Xử lý khi nhận sự kiên "on-chat"
  socket.on("on-chat", (msg) => {
    // sử dung "io.emit" để phát lại sự kiện "user-chat" đến tất cả các clients đã kết nối với máy chủ
    io.emit("new-msg", msg);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
