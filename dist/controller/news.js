"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthlyViewsByCategory = exports.getMonthlyViews = exports.getTopPerformingNewsBasedOnViews = exports.getAllDashboardData = exports.getAllHeadlineNews = exports.trackNewsView = exports.deleteNews = exports.getNewById = exports.updateNews = exports.getTotalNews = exports.getRecentNews = exports.getAllPublishedNews = exports.getAllNews = exports.publishNews = exports.createNews = void 0;
const logger_1 = require("../utils/logger");
const news_1 = require("../services/news");
const email_1 = require("../services/email");
const apiError_1 = require("../utils/apiError");
const createNews = async (req, res) => {
    const { newsTitle, createdBy } = req.body;
    try {
        const { freshNews } = await (0, news_1.createNewsService)(req.body);
        await Promise.all([
            (0, logger_1.logActivity)(req.user.id.toString() || "system", // Use req.user.id if available, otherwise default to "system"
            "CREATE_NEWS", `News article "${newsTitle}" was created`, req, freshNews ? freshNews._id.toString() : "", "News"),
            (0, email_1.sendCreateNewsEmail)({ newsTitle, createdBy }),
        ]);
        res.status(201).json({
            success: true,
            message: "News successfully created",
            data: {
                freshNews,
            },
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.createNews = createNews;
const publishNews = async (req, res) => {
    try {
        const newsId = req.params.id;
        const { news } = await (0, news_1.publishNewsService)(newsId);
        await (0, logger_1.logActivity)(req.body.userId || "system", // You might need to add userId to the request
        "PUBLISH_NEWS", `News article "${news.newsTitle}" was published`, req, news._id.toString(), "News");
        return res.status(200).json({ message: "News is published successfully" });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.publishNews = publishNews;
const getAllNews = async (req, res) => {
    try {
        const { newsTitle = "", category = "", createdBy = "", dateFrom = "", dateTo = "", pageNo = 1, pageSize = 10, } = req.query;
        const { news, total } = await (0, news_1.getAllNewsService)({
            newsTitle,
            category,
            createdBy,
            dateFrom,
            dateTo,
            pageNo,
            pageSize,
        });
        res.status(200).json({
            success: true,
            message: "Successful",
            currentPage: Number(pageNo),
            totalPages: Math.ceil(total / Number(pageSize)),
            totalItems: total,
            data: news,
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.getAllNews = getAllNews;
const getRecentNews = async (req, res) => {
    try {
        const { recentNews } = await (0, news_1.getRecentNewsService)();
        res.status(200).json({
            success: true,
            message: "Successfully retrieved recent news",
            data: recentNews,
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.getRecentNews = getRecentNews;
const getAllHeadlineNews = async (req, res) => {
    try {
        const { headLineNews } = await (0, news_1.getHeadLineNewsServce)();
        res.status(200).json({
            success: true,
            message: "Successfully retrieved headline news",
            data: headLineNews,
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.getAllHeadlineNews = getAllHeadlineNews;
const getAllPublishedNews = async (req, res) => {
    try {
        const { page = 1, limit = 10, category } = req.query;
        const { total, publishedNews } = await (0, news_1.getAllPublishedNewsService)({
            page,
            limit,
            category,
        });
        res.status(200).json({
            success: true,
            message: "Successful",
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalItems: total,
            data: publishedNews,
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.getAllPublishedNews = getAllPublishedNews;
// const getAllPublishedNews = async (req: Request, res: Response) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const category = req.query.category as string | undefined;
//     // 🚀 Cache for 60–120 seconds at the edge
//     res.setHeader(
//       "Cache-Control",
//       "public, s-maxage=120, stale-while-revalidate=60"
//     );
//     const { total, publishedNews } = await getAllPublishedNewsService({
//       page,
//       limit,
//       category,
//     });
//     return res.status(200).json({
//       success: true,
//       message: "Successful",
//       currentPage: page,
//       totalPages: Math.ceil(total / limit),
//       totalItems: total,
//       data: publishedNews,
//     });
//   } catch (error) {
//     const { message, statusCode } = customErrorHandler(error);
//     return res.status(statusCode || 500).json({
//       success: false,
//       message,
//     });
//   }
// };
const getTotalNews = async (req, res) => {
    const { totalNews } = await (0, news_1.getTotalNewsService)();
    res.status(200).json({
        success: true,
        message: "Successful",
        data: totalNews,
    });
};
exports.getTotalNews = getTotalNews;
const getNewById = async (req, res) => {
    const id = req.params.id;
    try {
        const { news } = await (0, news_1.getNewsByIdService)(id);
        res.status(200).json({
            success: true,
            data: news,
            message: "Successful",
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.getNewById = getNewById;
const updateNews = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
        const { data } = await (0, news_1.updateNewsService)({ id, body });
        // Log news update
        await (0, logger_1.logActivity)(req.body.userId || data.createdBy, "UPDATE_NEWS", `News article "${data.newsTitle}" was updated`, req, data._id.toString(), "News");
        res.status(200).json({
            success: true,
            message: "News updated",
            data,
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.updateNews = updateNews;
const deleteNews = async (req, res) => {
    const id = req.params.id;
    try {
        const { news } = await (0, news_1.deleteNewsService)(id);
        // Log news deletion
        await (0, logger_1.logActivity)(req.body.userId || news.createdBy, "DELETE_NEWS", `News article "${news.newsTitle}" was deleted`, req, news._id.toString(), "News");
        res.status(200).json({
            success: true,
            message: "News deleted successfully",
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.deleteNews = deleteNews;
const trackNewsView = async (req, res) => {
    try {
        const { newsId } = req.params;
        const { news, currentMonthViews } = await (0, news_1.trackNewsViewService)(newsId);
        res.status(200).json({
            success: true,
            message: "View recorded",
            views: news.views,
            currentMonthViews,
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.trackNewsView = trackNewsView;
const getAllDashboardData = async (req, res) => {
    try {
        const { totalViewsResult, unpublishedArticles } = await (0, news_1.getAllDashboardDataService)();
        const responseData = {
            totalViews: totalViewsResult.length > 0 ? totalViewsResult[0].totalViews : 0,
            totalArticles: totalViewsResult.length > 0 ? totalViewsResult[0].totalArticles : 0,
            totalAuthors: totalViewsResult.length > 0
                ? totalViewsResult[0].uniqueAuthors.length
                : 0,
            unpublishedArticles: unpublishedArticles,
        };
        res.status(200).json({
            success: true,
            message: "News statistics retrieved successfully",
            data: responseData,
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.getAllDashboardData = getAllDashboardData;
const getTopPerformingNewsBasedOnViews = async (req, res) => {
    try {
        const { topResult } = await (0, news_1.topPerformingNewsService)();
        return res.status(200).json({ success: true, data: topResult });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.getTopPerformingNewsBasedOnViews = getTopPerformingNewsBasedOnViews;
const getMonthlyViews = async (req, res) => {
    try {
        const { result } = await (0, news_1.monthlyViewsService)();
        return res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.getMonthlyViews = getMonthlyViews;
const getMonthlyViewsByCategory = async (req, res) => {
    try {
        const monthParam = req.params.month;
        const yearParam = req.params.year;
        const { month, year, result } = await (0, news_1.monthlyViewsByCategoryService)({
            monthParam,
            yearParam,
        });
        return res.status(200).json({
            success: true,
            message: "Monthly views by category retrieved successfully",
            data: { month, year, categories: result },
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.getMonthlyViewsByCategory = getMonthlyViewsByCategory;
//# sourceMappingURL=news.js.map