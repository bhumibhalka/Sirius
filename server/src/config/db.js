import mongoose from "mongoose";
import { ENV } from "../lib/ENV.js";

export const connectDB = async() => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(`Failed to connect MongoDB:`,error);
    process.exit(1);
  }
}

