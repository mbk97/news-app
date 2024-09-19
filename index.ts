import express, { Express } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { userRouter } from "./routes/user";
import { newsRouter } from "./routes/news";

dotenv.config();
connectDB();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/news-app-auth", userRouter);
app.use("/news-app", newsRouter);

app.listen(PORT, () => console.log(`server is running on Port: ${PORT}`));
