"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsRouter = void 0;
const express_1 = require("express");
const news_1 = require("../controller/news");
const authenticator_1 = require("../middlewares/authenticator");
const roleBasedPermission_1 = require("../middlewares/roleBasedPermission");
const news_2 = require("../middlewares/news");
const newsRouter = (0, express_1.Router)();
exports.newsRouter = newsRouter;
// Admin routes
newsRouter.put("/publish/:id", authenticator_1.authenticateUser, (0, roleBasedPermission_1.authorizeRoles)("Admin", "NaijaDaily"), news_1.publishNews);
newsRouter.delete("/:id", authenticator_1.authenticateUser, (0, roleBasedPermission_1.authorizeRoles)("Admin"), news_1.deleteNews);
newsRouter.post("/create", authenticator_1.authenticateUser, news_2.createNewsValidatorMiddleware, (0, roleBasedPermission_1.authorizeRoles)("Admin", "Editor", "Writer", "NaijaDaily"), news_1.createNews);
newsRouter.get("/", authenticator_1.authenticateUser, news_1.getAllNews);
newsRouter.get("/total-news", authenticator_1.authenticateUser, news_1.getTotalNews);
newsRouter.get("/recent-news", authenticator_1.authenticateUser, news_1.getRecentNews);
newsRouter.get("/dashboard-data", authenticator_1.authenticateUser, news_1.getAllDashboardData);
newsRouter.get("/top-performing-news", authenticator_1.authenticateUser, news_1.getTopPerformingNewsBasedOnViews);
newsRouter.get("/monthly-views", authenticator_1.authenticateUser, news_1.getMonthlyViews);
newsRouter.get("/monthly-category-views", authenticator_1.authenticateUser, news_1.getMonthlyViewsByCategory);
newsRouter.put("/:id", authenticator_1.authenticateUser, news_2.createNewsValidatorMiddleware, news_1.updateNews);
// client side routes
newsRouter.get("/published", news_1.getAllPublishedNews);
newsRouter.get("/headlines", news_1.getAllHeadlineNews);
newsRouter.get("/:id", news_1.getNewById);
newsRouter.post("/news-view/:newsId", news_1.trackNewsView);
//# sourceMappingURL=news.js.map