"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeadLineNewsServce = exports.monthlyViewsByCategoryService = exports.monthlyViewsService = exports.topPerformingNewsService = exports.getAllDashboardDataService = exports.trackNewsViewService = exports.deleteNewsService = exports.updateNewsService = exports.getNewsByIdService = exports.getTotalNewsService = exports.getAllPublishedNewsService = exports.getRecentNewsService = exports.getAllNewsService = exports.publishNewsService = exports.createNewsService = void 0;
const categoryModel_1 = __importDefault(require("../../model/categoryModel"));
const newsModel_1 = __importDefault(require("../../model/newsModel"));
const apiError_1 = require("../../utils/apiError");
const createNewsService = async ({ newsTitle, newsBody, newsImage, createdBy, category, subHeadline, headline, }) => {
    const checkIfCategoryIsCorrect = await categoryModel_1.default.findOne({
        categoryName: { $regex: `^${category}$`, $options: "i" },
    });
    if (!checkIfCategoryIsCorrect)
        throw new apiError_1.ApiError(400, "Category does not exist");
    const freshNews = await newsModel_1.default.create({
        newsTitle,
        newsBody,
        newsImage,
        createdBy,
        category,
        subHeadline,
        headline: typeof headline === "boolean" ? String(headline) : headline,
        publish: false,
    });
    return { freshNews };
};
exports.createNewsService = createNewsService;
const publishNewsService = async (newsId) => {
    const news = await newsModel_1.default.findById(newsId);
    if (!news)
        throw new Error("News not found!");
    if (news.publish)
        throw new apiError_1.ApiError(400, "News is already published");
    news.publish = true;
    await news.save(); // Ensure save is awaited
    return { news };
};
exports.publishNewsService = publishNewsService;
const getAllNewsService = async ({ newsTitle, category, createdBy, dateFrom, dateTo, pageNo, pageSize, }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter = {};
    if (newsTitle)
        filter.newsTitle = { $regex: newsTitle, $options: "i" };
    if (category)
        filter.category = category;
    if (createdBy)
        filter.createdBy = { $regex: createdBy, $options: "i" };
    if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom)
            filter.createdAt.$gte = new Date(dateFrom);
        if (dateTo)
            filter.createdAt.$lte = new Date(dateTo);
    }
    const skip = (Number(pageNo) - 1) * Number(pageSize);
    const total = await newsModel_1.default.countDocuments(filter);
    const news = await newsModel_1.default.find(filter)
        .lean()
        .skip(skip)
        .limit(Number(pageSize))
        .sort({ createdAt: -1 });
    return { news, total };
};
exports.getAllNewsService = getAllNewsService;
const getRecentNewsService = async () => {
    const recentNews = await newsModel_1.default.find().sort({ createdAt: -1 }).limit(10).lean();
    return { recentNews };
};
exports.getRecentNewsService = getRecentNewsService;
const getHeadLineNewsServce = async () => {
    const headLineNews = await newsModel_1.default.find({
        headline: "true",
        publish: true,
    })
        .limit(10)
        .lean();
    return { headLineNews };
};
exports.getHeadLineNewsServce = getHeadLineNewsServce;
const getAllPublishedNewsService = async ({ page, limit, category }) => {
    const filter = { publish: true };
    if (category) {
        filter.category = category;
    }
    const skip = (Number(page) - 1) * Number(limit);
    const total = await newsModel_1.default.countDocuments(filter);
    const publishedNews = await newsModel_1.default.find(filter)
        .lean()
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }); // optional sorting by newest first
    return { total, publishedNews };
};
exports.getAllPublishedNewsService = getAllPublishedNewsService;
const getTotalNewsService = async () => {
    const totalNews = await newsModel_1.default.countDocuments();
    return { totalNews };
    return { totalNews };
};
exports.getTotalNewsService = getTotalNewsService;
const getNewsByIdService = async (id) => {
    const news = await newsModel_1.default.findById(id);
    if (!news)
        throw new apiError_1.ApiError(400, "News not found");
    return { news };
};
exports.getNewsByIdService = getNewsByIdService;
const updateNewsService = async ({ id, body }) => {
    const newsToBeUpdated = await newsModel_1.default.findById(id).lean();
    if (!newsToBeUpdated)
        throw new apiError_1.ApiError(400, "News not found");
    const data = await newsModel_1.default.findByIdAndUpdate(id, body, {
        new: true,
    });
    return { data };
};
exports.updateNewsService = updateNewsService;
const deleteNewsService = async (id) => {
    const news = await newsModel_1.default.findById(id);
    if (!news)
        throw new apiError_1.ApiError(400, "News not found");
    await news.deleteOne();
    return { news };
};
exports.deleteNewsService = deleteNewsService;
const trackNewsViewService = async (newsId) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear();
    const monthKey = `monthlyViews.${currentYear}.${currentMonth}`;
    // Update both total views and monthly views
    const news = await newsModel_1.default.findByIdAndUpdate(newsId, {
        $inc: {
            views: 1, // Increment total views
            [monthKey]: 1, // Increment views for current month
        },
        $push: { viewDates: currentDate }, // Add timestamp to viewDates array
    }, { new: true }).lean();
    if (!news)
        throw new apiError_1.ApiError(400, "News not found");
    // Get the current month's views
    const currentMonthViews = news.monthlyViews?.[currentYear]?.[currentMonth] || 0;
    return { news, currentMonthViews };
};
exports.trackNewsViewService = trackNewsViewService;
const getAllDashboardDataService = async () => {
    // Get total views across all news articles
    const totalViewsResult = await newsModel_1.default.aggregate([
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }, // Sum all views from all news
                totalArticles: { $sum: 1 }, // Count all articles
                uniqueAuthors: { $addToSet: "$createdBy" }, // Collect unique authors
            },
        },
    ]);
    // Get unpublished articles
    const unpublishedArticles = await newsModel_1.default.find({ publish: false }, { newsTitle: 1, createdAt: 1, createdBy: 1, _id: 1 }).lean();
    return { totalViewsResult, unpublishedArticles };
};
exports.getAllDashboardDataService = getAllDashboardDataService;
const topPerformingNewsService = async () => {
    const topNews = await newsModel_1.default.find().sort({ views: -1 }).limit(10).lean(); // Sort descending by views
    const topResult = topNews.filter((news) => news.views > 10); // Only return items with views > 10
    return { topResult };
};
exports.topPerformingNewsService = topPerformingNewsService;
const monthlyViewsService = async () => {
    const monthlyViews = await newsModel_1.default.aggregate([
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                },
                totalViews: { $sum: "$views" },
            },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }, // Sort by year and month
    ]);
    // Array of all month names
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    // Get all unique years from the aggregated data
    const years = [...new Set(monthlyViews.map((entry) => entry._id.year))];
    // Initialize result with all 12 months and set views to 0 by default
    const result = years.map((year) => {
        const monthsData = monthNames.map((month, index) => {
            // Find the matching month in the aggregated data
            const existingMonth = monthlyViews.find((entry) => entry._id.year === year && entry._id.month === index + 1);
            return {
                month,
                year,
                totalViews: existingMonth ? existingMonth.totalViews : 0, // Default to 0 if not found
            };
        });
        return { year, months: monthsData };
    });
    return { result };
};
exports.monthlyViewsService = monthlyViewsService;
const monthlyViewsByCategoryService = async ({ monthParam, yearParam }) => {
    // Get month and year from query params or use current month/year
    const today = new Date();
    const month = parseInt(monthParam) || today.getMonth() + 1;
    const year = parseInt(yearParam) || today.getFullYear();
    // Aggregate news views by category for the specified month
    const categoryViews = await newsModel_1.default.aggregate([
        {
            $match: {
                [`monthlyViews.${year}.${month}`]: { $exists: true, $gt: 0 },
            },
        },
        {
            $group: {
                _id: "$category",
                totalViews: { $sum: `$monthlyViews.${year}.${month}` },
            },
        },
        {
            $project: {
                _id: 0,
                categoryName: "$_id",
                views: "$totalViews",
            },
        },
        { $sort: { views: -1 } },
    ]);
    // Get all categories to ensure we include ones with zero views
    const allCategories = await categoryModel_1.default.find({}, { categoryName: 1, _id: 0 });
    const categoryViewsMap = new Map();
    categoryViews.forEach((item) => {
        categoryViewsMap.set(item.categoryName, item.views);
    });
    const result = allCategories.map((cat) => ({
        categoryName: cat.categoryName,
        views: categoryViewsMap.get(cat.categoryName) || 0,
    }));
    result.sort((a, b) => b.views - a.views);
    return { month, year, result };
};
exports.monthlyViewsByCategoryService = monthlyViewsByCategoryService;
//# sourceMappingURL=index.js.map