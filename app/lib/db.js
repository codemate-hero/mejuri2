import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");
import mongoose from "mongoose";
import "@/app/models/Product";

const mongoUri = process.env.MONGODB_URI;
const mongoFallbackHosts = process.env.MONGODB_FALLBACK_HOSTS;
const mongoFallbackReplicaSet = process.env.MONGODB_FALLBACK_REPLICA_SET;

function getFallbackUri(uri) {
  if (!mongoFallbackHosts || !mongoFallbackReplicaSet) return null;

  const parsed = new URL(uri);
  if (parsed.protocol !== "mongodb+srv:") return null;

  const credentials = parsed.username
    ? `${parsed.username}${parsed.password ? `:${parsed.password}` : ""}@`
    : "";
  const options = new URLSearchParams(parsed.search);
  options.set("tls", "true");
  options.set("authSource", options.get("authSource") || "admin");
  options.set("replicaSet", mongoFallbackReplicaSet);

  return `mongodb://${credentials}${mongoFallbackHosts}${parsed.pathname}?${options}`;
}

const globalForMongoose = globalThis;
const mongooseCache = globalForMongoose.__mongooseCache ?? {
  connection: null,
  promise: null,
};

globalForMongoose.__mongooseCache = mongooseCache;

if (!mongoUri) {
  console.warn("MONGODB_URI is not set. MongoDB requests will fail until it is configured.");
}

export async function connectDB() {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (mongoose.connection.readyState === 1) {
    mongooseCache.connection = mongoose;
    return mongooseCache.connection;
  }

  if (!mongooseCache.promise) {
    mongooseCache.promise = mongoose
      .connect(mongoUri, { serverSelectionTimeoutMS: 10000 })
      .catch(async (error) => {
        const fallbackUri = getFallbackUri(mongoUri);
        const isSrvDnsFailure =
          error?.code === "ECONNREFUSED" && error?.syscall === "querySrv";

        if (!fallbackUri || !isSrvDnsFailure) throw error;

        console.warn("MongoDB SRV DNS failed; retrying with configured seed hosts.");
        return mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 10000 });
      });
  }

  try {
    mongooseCache.connection = await mongooseCache.promise;
    return mongooseCache.connection;
  } catch (error) {
    // Allow the next request to retry after a transient DNS/network failure.
    mongooseCache.promise = null;
    mongooseCache.connection = null;
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}
