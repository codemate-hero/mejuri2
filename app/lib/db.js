import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");
import mongoose from "mongoose";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.warn("MONGODB_URI is not set. MongoDB requests will fail until it is configured.");
}

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}