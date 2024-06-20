import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import { join } from "path";
import User from "../features/authentication/models/userModel";
import Cabin from "../features/cabins/model/CabinsModel";
import Guest from "../features/guests/model/GuestsModel"; // Make sure to provide the correct path
import Settings from "../features/settings/model/SettingsModel"; // Make sure to provide the correct path
import Booking from "../features/bookings/model/BookingsModel"; // Make sure to provide the correct path

dotenv.config({ path: "./config.env" });

const DB: string = process.env.DATABASE_LOCAL!.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
);

mongoose
  .connect(DB)
  .then(() => console.log("Connection to DB is successful"))
  .catch((err) => console.error("DB connection failed:", err));

// READ JSON FILES
const users = JSON.parse(
  fs.readFileSync(join(process.cwd(), `./src/dev/users.json`), "utf-8")
);

const cabins = JSON.parse(
  fs.readFileSync(join(process.cwd(), `./src/dev/cabins.json`), "utf-8")
);

const guests = JSON.parse(
  fs.readFileSync(join(process.cwd(), `./src/dev/guests.json`), "utf-8")
);

const settings = JSON.parse(
  fs.readFileSync(join(process.cwd(), `./src/dev/settings.json`), "utf-8")
);

const bookings = JSON.parse(
  fs.readFileSync(join(process.cwd(), `./src/dev/bookings.json`), "utf-8")
);

// IMPORT USER DATA INTO DB
const importUserData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    console.log("User data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// IMPORT CABIN DATA INTO DB
const importCabinData = async () => {
  try {
    await Cabin.create(cabins, { validateBeforeSave: false });
    console.log("Cabin data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// IMPORT GUEST DATA INTO DB
const importGuestData = async () => {
  try {
    await Guest.create(guests, { validateBeforeSave: false });
    console.log("Guest data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// IMPORT SETTINGS DATA INTO DB
const importSettingsData = async () => {
  try {
    await Settings.create(settings, { validateBeforeSave: false });
    console.log("Settings data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// IMPORT BOOKING DATA INTO DB
const importBookingData = async () => {
  try {
    await Booking.create(bookings, { validateBeforeSave: false });
    console.log("Booking data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL USER DATA FROM DB
const deleteUserData = async () => {
  try {
    await User.deleteMany({});
    console.log("User data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL CABIN DATA FROM DB
const deleteCabinData = async () => {
  try {
    await Cabin.deleteMany({});
    console.log("Cabin data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL GUEST DATA FROM DB
const deleteGuestData = async () => {
  try {
    await Guest.deleteMany({});
    console.log("Guest data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL SETTINGS DATA FROM DB
const deleteSettingsData = async () => {
  try {
    await Settings.deleteMany({});
    console.log("Settings data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL BOOKING DATA FROM DB
const deleteBookingData = async () => {
  try {
    await Booking.deleteMany({});
    console.log("Booking data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importUserData();
} else if (process.argv[2] === "--delete") {
  deleteUserData();
} else if (process.argv[2] === "--cabins") {
  importCabinData();
} else if (process.argv[2] === "--delete-cabins") {
  deleteCabinData();
} else if (process.argv[2] === "--guests") {
  importGuestData();
} else if (process.argv[2] === "--delete-guests") {
  deleteGuestData();
} else if (process.argv[2] === "--settings") {
  importSettingsData();
} else if (process.argv[2] === "--delete-settings") {
  deleteSettingsData();
} else if (process.argv[2] === "--bookings") {
  importBookingData();
} else if (process.argv[2] === "--delete-bookings") {
  deleteBookingData();
}

export { };

async function main() {
  // Entry point for other operations if needed
}

main();
