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
} from "../controller/news/news";

const newsRouter = Router();

newsRouter.post("/create", createNews);
newsRouter.get("/", getAllNews);
newsRouter.get("/published", getAllPublishedNews);
newsRouter.get("/total-news", getTotalNews);
newsRouter.get("/recent-news", getRecentNews);
newsRouter.post("/news-view/:newsId", trackNewsView);
newsRouter.get("/dashboard-data", getAllDashboardData);
newsRouter.get("/top-performing-news", getTopPerformingNewsBasedOnViews);
newsRouter.get("/monthly-views", getMonthlyViews);
newsRouter.get("/monthly-category-views", getMonthlyViewsByCategory);
newsRouter.get("/:id", getNewById);
newsRouter.put("/:id", updateNews);
newsRouter.put("/publish/:id", publishNews);
newsRouter.delete("/:id", deleteNews);

export { newsRouter };
