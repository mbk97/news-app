"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redis = new ioredis_1.default(process.env.REDIS_URL);
exports.redis = redis;
// Log when Redis connects successfully
redis.on("connect", () => {
    console.log("✅ Redis connected successfully");
});
// Log any Redis connection errors
redis.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});
//# sourceMappingURL=index.js.map