import dotenv from "dotenv";
import mongoose from "mongoose";
import { server } from "./app";

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
	console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
	console.error(err.name, err.message);
	process.exit(1);
});

// Configuring environment variables
dotenv.config({ path: "./config.env" });

// Database connection
// biome-ignore lint/style/noNonNullAssertion: <explanation>
const DB: string = process.env.DATABASE_LOCAL!.replace(
	"<PASSWORD>",
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	process.env.DATABASE_PASSWORD!,
);

export const db = mongoose
	.connect(DB)
	.then(() => console.log("Connection to DB is successful"))
	.catch((err) => console.error("DB connection failed:", err));




// create a session for mongoose
export const getMongo = () => {
	return mongoose;
};
// Starting the server
const port = 3000;
server.listen(port, () => {
	console.log(`Server started on http://localhost:${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
	console.error("UNHANDLED REJECTION! 💥 Shutting down...");
	console.error(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
