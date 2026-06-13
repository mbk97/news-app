import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import { userRouter } from "./routes/user";
import { newsRouter } from "./routes/news";
import { categoryRouter } from "./routes/category";
import { roleRouter } from "./routes/role";
import { errorHandler } from "./middlewares/error/errorHandler";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// ===== 1. Handle Preflight OPTIONS Requests FIRST =====
app.options("*", cors());

// ===== 2. Global CORS Configuration =====
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://www.naijadaily.ng",
      "https://news-admin-app-fe-7vvg.onrender.com",
      "https://naijadaily.vercel.app",
      "https://news-admin-app-fe.vercel.app",
      "https://news-admin-app-938zf28pk-mbk97s-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

// ===== 3. Body Parsers (Must be before routes) =====
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ===== 4. Routes =====
app.use("/news-app-auth", userRouter);
app.use("/news-app", newsRouter);
app.use("/news-app-category", categoryRouter);
app.use("/news-app-roles", roleRouter);

// ===== Error handler =====
app.use(errorHandler);

// ===== DB Connection =====
connectDB().catch((err) => {
  console.error("❌ DB connection failed", err);
});

// ===== Listen =====
app.listen(PORT, () => {
  console.log(`✅ Local server running on port ${PORT}`);
});

export default app;
