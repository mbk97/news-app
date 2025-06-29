import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis(process.env.REDIS_URL as string);

// Log when Redis connects successfully
redis.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

// Log any Redis connection errors
redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

export { redis };
