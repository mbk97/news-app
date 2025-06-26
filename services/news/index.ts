import Category from "../../model/categoryModel";
import News from "../../model/newsModel";
import { ICreateNews } from "../../types";

const createNewsService = async ({
  newsTitle,
  newsBody,
  newsImage,
  createdBy,
  category,
  subHeadline,
}: ICreateNews) => {
  const checkIfCategoryIsCorrect = await Category.findOne({
    categoryName: { $regex: `^${category}$`, $options: "i" },
  });

  if (!checkIfCategoryIsCorrect) throw new Error("Category does not exist");

  const freshNews = await News.create({
    newsTitle,
    newsBody,
    newsImage,
    createdBy,
    category,
    subHeadline,
    publish: false,
  });

  return { freshNews };
};

const publishNewsService = async (newsId: string) => {
  const news = await News.findById(newsId);
  if (!news) throw new Error("News not found!");
  if (news.publish) throw new Error("News is already published");
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
  if (!news) throw new Error("News not found");
  return { news };
};

const updateNewsService = async ({ id, body }) => {
  const newsToBeUpdated = await News.findById(id);
  if (!newsToBeUpdated) throw new Error("News not found");

  const data = await News.findByIdAndUpdate(id, body, {
    new: true,
  });

  return { data };
};

const deleteNewsService = async (id: string) => {
  const news = await News.findById(id);
  if (!news) throw new Error("News not found");
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

  if (!news) throw new Error("News not found");

  // Get the current month's views
  const currentMonthViews =
    news.monthlyViews?.[currentYear]?.[currentMonth] || 0;

  return { news, currentMonthViews };
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
};
