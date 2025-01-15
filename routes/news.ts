import { Router } from "express";
import {
  createNews,
  deleteNews,
  getAllNews,
  getNewById,
  updateNews,
} from "../controller/news";

const newsRouter = Router();

newsRouter.post("/create", createNews);
newsRouter.get("/", getAllNews);
newsRouter.get("/:id", getNewById);
newsRouter.put("/:id", updateNews);
newsRouter.delete("/:id", deleteNews);

export { newsRouter };
