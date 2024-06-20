// Import necessary modules
import { Server as HttpServer } from "http";
import { Server as IOServer, Socket } from "socket.io";

// This variable will hold the Socket.IO server instance
let io: IOServer | null = null;
export let roomId = "1";
// Initializes the Socket.IO server
export const initSocketServer = (httpServer: HttpServer): IOServer => {
  io = new IOServer(httpServer, {
    // Here you can set Socket.IO configurations
    cors: {
      origin: "*", // Be sure to lock down your CORS settings in production
      methods: ["GET", "POST"],
      // allowedHeaders: ["my-custom-header"],
      // credentials: true,
    },
  });

  io.on("error", (err) => {
    console.log(`Socket.IO error: ${err}`);
  });
  io.on("connection", (socket: Socket) => {
    roomId = socket.id;
    console.log(`New connection: ${socket.id}`);

    socket.on("new_message", (data) => {
      console.log(data);
    });

    // Handle socket events, you can define custom events inside this block
    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
    });
  });

  console.log(`Socket.IO server initialized ${io}`);
  return io;
};

// Function to get the Socket.IO server instance
export const getSocketServer = (): IOServer => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
