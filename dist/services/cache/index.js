"use strict";
// services/cacheService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCacheByPattern = exports.deleteCache = exports.setCache = exports.getCache = void 0;
const redis_1 = require("../../redis");
/**
 * Get cached value by key
 */
const getCache = async (key) => {
    try {
        const cached = await redis_1.redis.get(key);
        if (!cached)
            return null;
        return JSON.parse(cached);
    }
    catch (err) {
        console.error(`Failed to parse cache for key "${key}":`, err);
        return null;
    }
};
exports.getCache = getCache;
/**
 * Set value in cache with optional TTL (default 300 seconds)
 */
const setCache = async (key, value, ttlSeconds = 300) => {
    try {
        await redis_1.redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    }
    catch (err) {
        console.error(`Failed to set cache for key "${key}":`, err);
    }
};
exports.setCache = setCache;
/**
 * Delete one or more cache keys
 */
const deleteCache = async (...keys) => {
    if (!keys.length)
        return;
    try {
        await redis_1.redis.del(...keys);
    }
    catch (err) {
        console.error(`Failed to delete cache keys: ${keys.join(", ")}`, err);
    }
};
exports.deleteCache = deleteCache;
/**
 * Delete keys matching a pattern (e.g. "news:*")
 */
const deleteCacheByPattern = async (pattern) => {
    try {
        const keys = await redis_1.redis.keys(pattern);
        if (keys.length > 0) {
            await redis_1.redis.del(...keys);
        }
    }
    catch (err) {
        console.error(`Failed to delete keys by pattern "${pattern}":`, err);
    }
};
exports.deleteCacheByPattern = deleteCacheByPattern;
//# sourceMappingURL=index.js.map