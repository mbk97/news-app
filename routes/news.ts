import { Router } from "express";
import {
  createNews,
  deleteNews,
  getAllNews,
  getAllPublishedNews,
  getAllDashboardData,
  getMonthlyViews,
  getMonthlyViewsByCategory,
  getNewById,
  getRecentNews,
  getTopPerformingNewsBasedOnViews,
  getTotalNews,
  publishNews,
  trackNewsView,
  updateNews,
} from "../controller/news";
import { authenticateUser } from "../middlewares/authenticator";
import { authorizeRoles } from "../middlewares/roleBasedPermission";
import { createNewsValidatorMiddleware } from "../middlewares/news";

const newsRouter = Router();

// Admin routes
newsRouter.put(
  "/publish/:id",
  authenticateUser,
  authorizeRoles("Admin"),
  publishNews
);
newsRouter.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("Admin"),
  deleteNews
);
newsRouter.post(
  "/create",
  authenticateUser,
  createNewsValidatorMiddleware,
  authorizeRoles("Admin", "Editor", "Writer"),
  createNews
);
newsRouter.get("/", authenticateUser, getAllNews);
newsRouter.get("/total-news", authenticateUser, getTotalNews);
newsRouter.get("/recent-news", authenticateUser, getRecentNews);
newsRouter.post("/news-view/:newsId", authenticateUser, trackNewsView);
newsRouter.get("/dashboard-data", authenticateUser, getAllDashboardData);
newsRouter.get(
  "/top-performing-news",
  authenticateUser,
  getTopPerformingNewsBasedOnViews
);
newsRouter.get("/monthly-views", authenticateUser, getMonthlyViews);
newsRouter.get(
  "/monthly-category-views",
  authenticateUser,
  getMonthlyViewsByCategory
);
newsRouter.put(
  "/:id",
  authenticateUser,
  createNewsValidatorMiddleware,
  updateNews
);

// client side routes
newsRouter.get("/published", getAllPublishedNews);
newsRouter.get("/:id", getNewById);

export { newsRouter };
