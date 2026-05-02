import {Server} from 'socket.io';

let io;
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

export const initailizeSocket = (server) => {
  io = new Server(server, {
    cors:  {
      origin: "http://localhost:5173",
      methods: ["GET","POST"],
      credentials: true,
    }
  });
  
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if(userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }
    
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    
    socket.on("disconnect", () => {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
    
    return io;
  })
}

export {io};