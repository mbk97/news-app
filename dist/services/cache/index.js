"use strict";
// services/cacheService.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCacheByPattern = exports.deleteCache = exports.setCache = exports.getCache = void 0;
const redis_1 = require("../../redis");
/**
 * Get cached value by key
 */
const getCache = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cached = yield redis_1.redis.get(key);
        if (!cached)
            return null;
        return JSON.parse(cached);
    }
    catch (err) {
        console.error(`Failed to parse cache for key "${key}":`, err);
        return null;
    }
});
exports.getCache = getCache;
/**
 * Set value in cache with optional TTL (default 300 seconds)
 */
const setCache = (key_1, value_1, ...args_1) => __awaiter(void 0, [key_1, value_1, ...args_1], void 0, function* (key, value, ttlSeconds = 300) {
    try {
        yield redis_1.redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    }
    catch (err) {
        console.error(`Failed to set cache for key "${key}":`, err);
    }
});
exports.setCache = setCache;
/**
 * Delete one or more cache keys
 */
const deleteCache = (...keys) => __awaiter(void 0, void 0, void 0, function* () {
    if (!keys.length)
        return;
    try {
        yield redis_1.redis.del(...keys);
    }
    catch (err) {
        console.error(`Failed to delete cache keys: ${keys.join(", ")}`, err);
    }
});
exports.deleteCache = deleteCache;
/**
 * Delete keys matching a pattern (e.g. "news:*")
 */
const deleteCacheByPattern = (pattern) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keys = yield redis_1.redis.keys(pattern);
        if (keys.length > 0) {
            yield redis_1.redis.del(...keys);
        }
    }
    catch (err) {
        console.error(`Failed to delete keys by pattern "${pattern}":`, err);
    }
});
exports.deleteCacheByPattern = deleteCacheByPattern;
//# sourceMappingURL=index.js.map