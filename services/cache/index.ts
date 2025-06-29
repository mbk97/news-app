// services/cacheService.ts

import { redis } from "../../redis";

/**
 * Get cached value by key
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const cached = await redis.get(key);
    if (!cached) return null;
    return JSON.parse(cached) as T;
  } catch (err) {
    console.error(`Failed to parse cache for key "${key}":`, err);
    return null;
  }
};

/**
 * Set value in cache with optional TTL (default 300 seconds)
 */
export const setCache = async <T>(
  key: string,
  value: T,
  ttlSeconds = 300
): Promise<void> => {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (err) {
    console.error(`Failed to set cache for key "${key}":`, err);
  }
};

/**
 * Delete one or more cache keys
 */
export const deleteCache = async (...keys: string[]): Promise<void> => {
  if (!keys.length) return;
  try {
    await redis.del(...keys);
  } catch (err) {
    console.error(`Failed to delete cache keys: ${keys.join(", ")}`, err);
  }
};

/**
 * Delete keys matching a pattern (e.g. "news:*")
 */
export const deleteCacheByPattern = async (pattern: string): Promise<void> => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (err) {
    console.error(`Failed to delete keys by pattern "${pattern}":`, err);
  }
};
