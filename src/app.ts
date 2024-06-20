import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import globalErrorHandler from "./core/controllers/errorController";
import userRoutes from "./features/users/routes/userRoutes";
import http from "http";
import AppError from "./core/utils/appError";
import postRoutes from "./features/posts/routes/postRoutes";
import guestsRoute from "./features/guests/routes/guestsRoutes";
import https from "https";
import fs from "fs";
// import {
//   getSocketServer,
//   initSocketServer,
// } from "./features/chat/utils/socket";
import chatRoutes from "./features/chat/routes/chatRoutes";
import authRoutes from "./features/authentication/routes/authRoutes";
import cors from "cors";
import friendsRoute from "./features/friends/routes/friendsRoute";
import { Server, Socket } from "socket.io";
import { removeSocketIdFromUser } from "./features/chat/controllers/chatControllers";
import User from "./features/authentication/models/userModel";
import cabinsRoutes from "./features/cabins/routes/cabinsRoutes";
import settingsRoutes from "./features/settings/routes/settingsRoutes";
import bookingsRoutes from "./features/bookings/routes/bookingsRoutes";
import path from "path";

const app = express();
User.updateMany({}, { $set: { socketIds: [] } }).exec();

/// add cors
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true, // Allow credentials
  optionSuccessStatus: 200,
};



// Use the cors middleware with the specified options
app.use(cors(corsOptions));
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  app.use((req: Request, res: Response, next: NextFunction) => {
    (req as any).requestTime = new Date().toISOString();
    // console.log(req.body);
    next();
  });
}

// Limit requests from the same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000, // 1 hour
//   message: "Too many requests from this IP, please try again in an hour!",
// });
// app.use("/api", limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// Middlewares
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Routes

// for dev purposes
// app.use("/api/v1/users", userRoutes);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/friends", friendsRoute);
app.use("/api/v1/cabins", cabinsRoutes);
app.use("/api/v1/guests", guestsRoute);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/bookings", bookingsRoutes);


// init socket
// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
// initSocketServer(server);

const io: Server = new Server(server, {
  cors: {
    origin: ["http://localhost:5000", "https://cdpn.io"],
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials
  },
  allowEIO3: true,
});

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`);
    removeSocketIdFromUser(socket.id);
  });

  socket.on("chat message", (e) => {
    console.log(`msg: ${e}`);
  });
});

// const io = getSocketServer();

// io.listen(server, {});
// Handle unhandled routes
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  // console.log(res);
  next(new AppError(`Cannot find the following path ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export { app, server, io };
