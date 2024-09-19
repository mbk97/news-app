import { Router } from "express";
import { createNews } from "../controller/news";

const newsRouter = Router();

newsRouter.post("/create", createNews);

export { newsRouter };
