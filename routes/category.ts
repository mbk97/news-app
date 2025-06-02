import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
} from "../controller/category";
import { authenticateUser } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/roles";

const categoryRouter = Router();

// Admin routes

categoryRouter.post(
  "/",
  authenticateUser,
  authorizeRoles("Admin"),
  createCategory
);
categoryRouter.delete("/:categoryId", deleteCategory);

// client side routes
categoryRouter.get("/", getAllCategory);

export { categoryRouter };
