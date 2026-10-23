
import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),
  username: process.env.REDIS_USERNAME || "default",
  password: process.env.REDIS_PASSWORD || undefined,

  // Use RESP2 instead of the newer RESP3 handshake
  protocol: 2,

  maxRetriesPerRequest: 1,
  connectTimeout: 5000,
  enableOfflineQueue: false,

  retryStrategy: (times) => {
    if (times > 3) return null;
    return Math.min(times * 200, 2000);
  },
});

redis.on("ready", () => {
  console.log("[CACHE REDIS] Connected successfully");
});

redis.on("error", (error) => {
  console.error("[CACHE REDIS] Error:", error.message);
});

export const getOrSetCache = async <T>(
  key: string,
  cb: () => Promise<T>,
  ttl = 3600
): Promise<T> => {
  try {
    const cachedData = await redis.get(key);

    if (cachedData !== null) {
      console.log("Cache hit:", key);
      return JSON.parse(cachedData) as T;
    }
  } catch (error) {
    console.error("Redis GET failed:", error);
  }

  console.log("Cache miss:", key);

  const freshData = await cb();

  try {
    await redis.setex(key, ttl, JSON.stringify(freshData));
  } catch (error) {
    console.error("Redis SET failed:", error);
  }

  return freshData;
};
