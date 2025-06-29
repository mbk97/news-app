import express, { Express } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { userRouter } from "./routes/user";
import { newsRouter } from "./routes/news";
import { categoryRouter } from "./routes/category";
import { roleRouter } from "./routes/role";
import cors from "cors";

dotenv.config();
connectDB();

const app: Express = express();
const PORT = process.env.PORT || 5000;

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
    ], // Allow multiple origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
    credentials: true, // Allow cookies and authorization headers
  })
);
app.use("/v2/news-app-auth", userRouter);
app.use("/v2/news-app", newsRouter);
app.use("/v2/news-app-category", categoryRouter);
app.use("/v2/news-app-roles", roleRouter);

app.listen(PORT, () => console.log(`server is running on Port: ${PORT}`));
