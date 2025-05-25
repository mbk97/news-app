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
  origin: ["http://localhost:5173", "https://naijadaily.ng"], // Allow multiple origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATHCH"], // Allowed HTTP methods
    credentials: true, // Allow cookies and authorization headers
  })
);

app.use("/news-app-auth", userRouter);
app.use("/news-app", newsRouter);
app.use("/news-app-category", categoryRouter);
app.use("/news-app-roles", roleRouter);

app.listen(PORT, () => console.log(`server is running on Port: ${PORT}`));
