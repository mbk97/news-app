// import express, { Express } from "express";
// import dotenv from "dotenv";
// import { connectDB } from "./config/db";
// import { userRouter } from "./routes/user";
// import { newsRouter } from "./routes/news";
// import { categoryRouter } from "./routes/category";
// import { roleRouter } from "./routes/role";
// import cors from "cors";
// import { errorHandler } from "./middlewares/error/errorHandler";

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

// ===== Middleware =====
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://www.naijadaily.ng",
      "https://naijadaily.vercel.app",
      "https://news-admin-app-fe.vercel.app",
      "https://news-admin-app-938zf28pk-mbk97s-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// ===== Routes =====
app.use("/news-app-auth", userRouter);
app.use("/news-app", newsRouter);
app.use("/news-app-category", categoryRouter);
app.use("/news-app-roles", roleRouter);

// ===== Error handler =====
app.use(errorHandler);

// ===== DB Connection (runs once per cold start on Vercel) =====
connectDB().catch((err) => {
  console.error("❌ DB connection failed", err);
});

// ===== ONLY listen locally =====
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`✅ Local server running on port ${PORT}`);
  });
}

// ===== Export for Vercel =====
export default app;
