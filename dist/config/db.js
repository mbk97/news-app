"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// export const connectDB = async () => {
//   try {
//     const connectionString =
//       process.env.NODE_ENV === "development"
//         ? process.env.MONGO_DB_URI_TEST
//         : process.env.MONGO_DB_URI;
//     const conn = await mongoose.connect(connectionString);
//     if (process.env.NODE_ENV === "development") {
//       console.log(`✅ mongoDB connected: ${conn.connection.host}`);
//     } else {
//       console.log("✅ mongoDB connected");
//     }
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//     // this terminates the process if there is an error
//   }
// };
// let isConnected = false;
// export const connectDB = async () => {
//   if (isConnected) return;
//   const connectionString =
//     process.env.NODE_ENV === "development"
//       ? process.env.MONGO_DB_URI_TEST
//       : process.env.MONGO_DB_URI;
//   const conn = await mongoose.connect(connectionString);
//   // isConnected = conn.connections[0].readyState;
//   isConnected = conn.connections[0].readyState === 1;
//   console.log("✅ MongoDB connected");
// };
// let cached = global.mongoose;
// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }
// export async function connectDB() {
//   if (cached.conn) return cached.conn;
//   const connectionString =
//     process.env.NODE_ENV === "development"
//       ? process.env.MONGO_DB_URI_TEST
//       : process.env.MONGO_DB_URI;
//   if (!cached.promise) {
//     cached.promise = mongoose
//       .connect(connectionString, {
//         maxPoolSize: 10, // optional: avoids too many idle pools
//       })
//       .then((mongoose) => mongoose);
//   }
//   cached.conn = await cached.promise;
//   console.log("✅ MongoDB connected");
//   return cached.conn;
// }
mongoose_1.default.set("strictQuery", true);
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        if (cached.conn)
            return cached.conn;
        const connectionString = process.env.NODE_ENV === "development"
            ? process.env.MONGO_DB_URI_TEST
            : process.env.MONGO_DB_URI;
        if (!connectionString) {
            throw new Error("❌ MongoDB connection string is missing");
        }
        if (!cached.promise) {
            cached.promise = mongoose_1.default
                .connect(connectionString, {
                maxPoolSize: 10,
            })
                .then((mongoose) => mongoose);
        }
        cached.conn = yield cached.promise;
        if (process.env.NODE_ENV !== "production") {
            console.log("✅ MongoDB connected");
        }
        return cached.conn;
    });
}
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map