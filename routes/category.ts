import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
} from "../controller/category";

const categoryRouter = Router();

categoryRouter.get("/", getAllCategory);
categoryRouter.post("/", createCategory);
categoryRouter.delete("/:categoryId", deleteCategory);

export { categoryRouter };
