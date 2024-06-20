import mongoose, { Document, Schema, Model, Query } from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import crypto from "crypto";

export const sessionIdSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
  },
  // add expiration date
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 90 * 24 * 60 * 60,
  },
});

export const SessionId = mongoose.model("SessionId", sessionIdSchema);
