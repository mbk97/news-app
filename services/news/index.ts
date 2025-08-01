import Category from "../../model/categoryModel";
import News from "../../model/newsModel";
import { ICreateNews } from "../../types";
import { ApiError } from "../../utils/apiError";

const createNewsService = async ({
  newsTitle,
  newsBody,
  newsImage,
  createdBy,
  category,
  subHeadline,
  headline,
}: ICreateNews) => {
  const checkIfCategoryIsCorrect = await Category.findOne({
    categoryName: { $regex: `^${category}$`, $options: "i" },
  });

  if (!checkIfCategoryIsCorrect)
    throw new ApiError(400, "Category does not exist");

  const freshNews = await News.create({
    newsTitle,
    newsBody,
    newsImage,
    createdBy,
    category,
    subHeadline,
    headline,
    publish: false,
  });

  return { freshNews };
};

const publishNewsService = async (newsId: string) => {
  const news = await News.findById(newsId);
  if (!news) throw new Error("News not found!");
  if (news.publish) throw new ApiError(400, "News is already published");
  news.publish = true;
  await news.save(); // Ensure save is awaited

  return { news };
};

const getAllNewsService = async ({
  newsTitle,
  category,
  createdBy,
  dateFrom,
  dateTo,
  pageNo,
  pageSize,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};

  if (newsTitle) filter.newsTitle = { $regex: newsTitle, $options: "i" };
  if (category) filter.category = category;
  if (createdBy) filter.createdBy = { $regex: createdBy, $options: "i" };
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom as string);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo as string);
  }

  const skip = (Number(pageNo) - 1) * Number(pageSize);
  const total = await News.countDocuments(filter);
  const news = await News.find(filter)
    .skip(skip)
    .limit(Number(pageSize))
    .sort({ createdAt: -1 });

  return { news, total };
};

const getRecentNewsService = async () => {
  const recentNews = await News.find().sort({ createdAt: -1 }).limit(10);
  return { recentNews };
};

const getHeadLineNewsServce = async () => {
  const headLineNews = await News.find({
    headline: true,
    pushlish: true,
  }).limit(10);
  return { headLineNews };
};

const getAllPublishedNewsService = async ({ page, limit, category }) => {
  const filter: Record<string, unknown> = { publish: true };
  if (category) {
    filter.category = category;
  }
  const skip = (Number(page) - 1) * Number(limit);
  const total = await News.countDocuments(filter);
  const publishedNews = await News.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 }); // optional sorting by newest first

  return { total, publishedNews };
};

const getTotalNewsService = async () => {
  const news = await News.find();
  const totalNews = news.length;

  return { totalNews };
};
const getNewsByIdService = async (id: string) => {
  const news = await News.findById(id);
  if (!news) throw new ApiError(400, "News not found");
  return { news };
};

const updateNewsService = async ({ id, body }) => {
  const newsToBeUpdated = await News.findById(id);
  if (!newsToBeUpdated) throw new ApiError(400, "News not found");

  const data = await News.findByIdAndUpdate(id, body, {
    new: true,
  });

  return { data };
};

const deleteNewsService = async (id: string) => {
  const news = await News.findById(id);
  if (!news) throw new ApiError(400, "News not found");
  await news.remove();

  return { news };
};

const trackNewsViewService = async (newsId: string) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear();
  const monthKey = `monthlyViews.${currentYear}.${currentMonth}`;

  // Update both total views and monthly views
  const news = await News.findByIdAndUpdate(
    newsId,
    {
      $inc: {
        views: 1, // Increment total views
        [monthKey]: 1, // Increment views for current month
      },
      $push: { viewDates: currentDate }, // Add timestamp to viewDates array
    },
    { new: true }
  );

  if (!news) throw new ApiError(400, "News not found");

  // Get the current month's views
  const currentMonthViews =
    news.monthlyViews?.[currentYear]?.[currentMonth] || 0;

  return { news, currentMonthViews };
};

const getAllDashboardDataService = async () => {
  // Get total views across all news articles
  const totalViewsResult = await News.aggregate([
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
  const unpublishedArticles = await News.find(
    { publish: false },
    { newsTitle: 1, createdAt: 1, createdBy: 1, _id: 1 }
  );

  return { totalViewsResult, unpublishedArticles };
};

const topPerformingNewsService = async () => {
  const topNews = await News.find().sort({ views: -1 }).limit(10); // Sort descending by views
  const topResult = topNews.filter((news) => news.views > 10); // Only return items with views > 10

  return { topResult };
};
const monthlyViewsService = async () => {
  const monthlyViews = await News.aggregate([
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
      const existingMonth = monthlyViews.find(
        (entry) => entry._id.year === year && entry._id.month === index + 1
      );

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

const monthlyViewsByCategoryService = async ({ monthParam, yearParam }) => {
  // Get month and year from query params or use current month/year
  const today = new Date();
  const month = parseInt(monthParam as string) || today.getMonth() + 1;
  const year = parseInt(yearParam as string) || today.getFullYear();

  // Aggregate news views by category for the specified month
  const categoryViews = await News.aggregate([
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
  const allCategories = await Category.find({}, { categoryName: 1, _id: 0 });
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

export {
  createNewsService,
  publishNewsService,
  getAllNewsService,
  getRecentNewsService,
  getAllPublishedNewsService,
  getTotalNewsService,
  getNewsByIdService,
  updateNewsService,
  deleteNewsService,
  trackNewsViewService,
  getAllDashboardDataService,
  topPerformingNewsService,
  monthlyViewsService,
  monthlyViewsByCategoryService,
  getHeadLineNewsServce,
};
