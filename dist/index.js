"use strict";
// import express, { Express } from "express";
// import dotenv from "dotenv";
// import { connectDB } from "./config/db";
// import { userRouter } from "./routes/user";
// import { newsRouter } from "./routes/news";
// import { categoryRouter } from "./routes/category";
// import { roleRouter } from "./routes/role";
// import cors from "cors";
// import { errorHandler } from "./middlewares/error/errorHandler";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// // connectDB();
// const app: Express = express();
// const PORT = process.env.PORT || 5000;
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://www.naijadaily.ng",
//       "https://naijadaily.vercel.app",
//       "https://news-admin-app-fe.vercel.app",
//       "https://news-admin-app-938zf28pk-mbk97s-projects.vercel.app",
//     ], // Allow multiple origins
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
//     credentials: true, // Allow cookies and authorization headers
//   })
// );
// app.use("/news-app-auth", userRouter);
// app.use("/news-app", newsRouter);
// app.use("/news-app-category", categoryRouter);
// app.use("/news-app-roles", roleRouter);
// app.use(errorHandler);
// (async () => {
//   try {
//     await connectDB(); // Don't proceed until DB connects
//     app.listen(PORT, () => {
//       console.log(`✅ Server is running on Port: ${PORT}`);
//     });
//   } catch (err) {
//     console.error("❌ Failed to start server", err);
//     process.exit(1);
//   }
// })();
// export default app;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const user_1 = require("./routes/user");
const news_1 = require("./routes/news");
const category_1 = require("./routes/category");
const role_1 = require("./routes/role");
const errorHandler_1 = require("./middlewares/error/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ===== Middleware =====
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://www.naijadaily.ng",
        "https://naijadaily.vercel.app",
        "https://news-admin-app-fe.vercel.app",
        "https://news-admin-app-938zf28pk-mbk97s-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));
// ===== Routes =====
app.use("/news-app-auth", user_1.userRouter);
app.use("/news-app", news_1.newsRouter);
app.use("/news-app-category", category_1.categoryRouter);
app.use("/news-app-roles", role_1.roleRouter);
// ===== Error handler =====
app.use(errorHandler_1.errorHandler);
// ===== DB Connection (runs once per cold start on Vercel) =====
(0, db_1.connectDB)().catch((err) => {
    console.error("❌ DB connection failed", err);
});
// ===== ONLY listen locally =====
// if (process.env.NODE_ENV !== "production") {
app.listen(PORT, () => {
    console.log(`✅ Local server running on port ${PORT}`);
});
// }
// ===== Export for Vercel =====
exports.default = app;
//# sourceMappingURL=index.js.map