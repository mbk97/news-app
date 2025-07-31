import { Response, Request } from "express";
import { logActivity } from "../utils/logger";
import {
  createNewsService,
  deleteNewsService,
  getAllDashboardDataService,
  getAllNewsService,
  getAllPublishedNewsService,
  getHeadLineNewsServce,
  getNewsByIdService,
  getRecentNewsService,
  getTotalNewsService,
  monthlyViewsByCategoryService,
  monthlyViewsService,
  publishNewsService,
  topPerformingNewsService,
  trackNewsViewService,
  updateNewsService,
} from "../services/news";
import { sendCreateNewsEmail } from "../services/email";
import { customErrorHandler } from "../utils/apiError";

const createNews = async (req: Request, res: Response) => {
  const { newsTitle, createdBy } = req.body;
  try {
    const { freshNews } = await createNewsService(req.body);
    await Promise.all([
      logActivity(
        req.user.id.toString() || "system", // Use req.user.id if available, otherwise default to "system"
        "CREATE_NEWS",
        `News article "${newsTitle}" was created`,
        req,
        freshNews._id.toString(),
        "News"
      ),
      sendCreateNewsEmail({ newsTitle, createdBy }),
    ]);
    res.status(201).json({
      success: true,
      message: "News successfully created",
      data: {
        freshNews,
      },
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const publishNews = async (req: Request, res: Response) => {
  try {
    const newsId = req.params.id;
    const { news } = await publishNewsService(newsId);

    await logActivity(
      req.body.userId || "system", // You might need to add userId to the request
      "PUBLISH_NEWS",
      `News article "${news.newsTitle}" was published`,
      req,
      news._id.toString(),
      "News"
    );
    return res.status(200).json({ message: "News is published successfully" });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const getAllNews = async (req: Request, res: Response) => {
  try {
    const {
      newsTitle = "",
      category = "",
      createdBy = "",
      dateFrom = "",
      dateTo = "",
      pageNo = 1,
      pageSize = 10,
    } = req.query;

    const { news, total } = await getAllNewsService({
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
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const getRecentNews = async (req: Request, res: Response) => {
  try {
    const { recentNews } = await getRecentNewsService();
    res.status(200).json({
      success: true,
      message: "Successfully retrieved recent news",
      data: recentNews,
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};
const getAllHeadlineNews = async (req: Request, res: Response) => {
  try {
    const { headLineNews } = await getHeadLineNewsServce();
    res.status(200).json({
      success: true,
      message: "Successfully retrieved headline news",
      data: headLineNews,
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const getAllPublishedNews = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    const { total, publishedNews } = await getAllPublishedNewsService({
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
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const getTotalNews = async (req: Request, res: Response) => {
  const { totalNews } = await getTotalNewsService();
  res.status(200).json({
    success: true,
    message: "Successful",
    data: totalNews,
  });
};

const getNewById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const { news } = await getNewsByIdService(id);
    res.status(200).json({
      success: true,
      data: news,
      message: "Successful",
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const updateNews = async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;

  try {
    const { data } = await updateNewsService({ id, body });
    // Log news update
    await logActivity(
      req.body.userId || data.createdBy,
      "UPDATE_NEWS",
      `News article "${data.newsTitle}" was updated`,
      req,
      data._id.toString(),
      "News"
    );
    res.status(200).json({
      success: true,
      message: "News updated",
      data,
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const deleteNews = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const { news } = await deleteNewsService(id);
    // Log news deletion
    await logActivity(
      req.body.userId || news.createdBy,
      "DELETE_NEWS",
      `News article "${news.newsTitle}" was deleted`,
      req,
      news._id.toString(),
      "News"
    );
    res.status(200).json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const trackNewsView = async (req: Request, res: Response) => {
  try {
    const { newsId } = req.params;
    const { news, currentMonthViews } = await trackNewsViewService(newsId);
    res.status(200).json({
      success: true,
      message: "View recorded",
      views: news.views,
      currentMonthViews,
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const getAllDashboardData = async (req: Request, res: Response) => {
  try {
    const { totalViewsResult, unpublishedArticles } =
      await getAllDashboardDataService();

    const responseData = {
      totalViews:
        totalViewsResult.length > 0 ? totalViewsResult[0].totalViews : 0,
      totalArticles:
        totalViewsResult.length > 0 ? totalViewsResult[0].totalArticles : 0,
      totalAuthors:
        totalViewsResult.length > 0
          ? totalViewsResult[0].uniqueAuthors.length
          : 0,
      unpublishedArticles: unpublishedArticles,
    };

    res.status(200).json({
      success: true,
      message: "News statistics retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const getTopPerformingNewsBasedOnViews = async (
  req: Request,
  res: Response
) => {
  try {
    const { topResult } = await topPerformingNewsService();
    return res.status(200).json({ success: true, data: topResult });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const getMonthlyViews = async (req: Request, res: Response) => {
  try {
    const { result } = await monthlyViewsService();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const getMonthlyViewsByCategory = async (req: Request, res: Response) => {
  try {
    const monthParam = req.params.month;
    const yearParam = req.params.year;

    const { month, year, result } = await monthlyViewsByCategoryService({
      monthParam,
      yearParam,
    });
    return res.status(200).json({
      success: true,
      message: "Monthly views by category retrieved successfully",
      data: { month, year, categories: result },
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

export {
  createNews,
  publishNews,
  getAllNews,
  getAllPublishedNews,
  getRecentNews,
  getTotalNews,
  updateNews,
  getNewById,
  deleteNews,
  trackNewsView,
  getAllHeadlineNews,
  getAllDashboardData,
  getTopPerformingNewsBasedOnViews,
  getMonthlyViews,
  getMonthlyViewsByCategory,
};
