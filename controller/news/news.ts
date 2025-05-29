import { Response, Request } from "express";
import { createNewsSchema, validate } from "../../utils/validation";
import News from "../../model/newsModel";
import Category from "../../model/categoryModel";
import { logActivity } from "../../utils/logger";

const createNews = async (req: Request, res: Response) => {
  const { newsTitle, newsBody, createdBy, newsImage, category } = req.body;

  const error = validate(createNewsSchema, req.body);

  if (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
    return;
  }

  try {
    const checkIfCategoryIsCorrect = await Category.findOne({
      categoryName: { $regex: `^${category}$`, $options: "i" },
    });

    if (!checkIfCategoryIsCorrect) {
      res.status(400).json({
        success: false,
        message: "Category does not exist",
      });
      return;
    }

    const freshNews = await News.create({
      newsTitle,
      newsBody,
      newsImage,
      createdBy,
      category,
      publish: false,
    });

    if (freshNews) {
      // Log news creation
      await logActivity(
        req.body.createdBy,
        "CREATE_NEWS",
        `News article "${newsTitle}" was created`,
        req,
        freshNews._id.toString(),
        "News"
      );

      res.status(201).json({
        success: true,
        message: "News successfully created",
        data: {
          freshNews,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const publishNews = async (req: Request, res: Response) => {
  try {
    const newsId = req.params.id;
    const news = await News.findById(newsId);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    if (news.publish) {
      return res.status(409).json({ message: "News is already published" });
    }

    news.publish = true;
    await news.save(); // Ensure save is awaited

    // Log news publishing
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
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getAllNews = async (req: Request, res: Response) => {
  const news = await News.find();
  res.status(200).json({
    success: true,
    message: "Successful",
    data: news,
  });
};

const getRecentNews = async (req: Request, res: Response) => {
  try {
    const recentNews = await News.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json({
      success: true,
      message: "Successfully retrieved recent news",
      data: recentNews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving news",
      error: error.message,
    });
  }
};

const getAllPublishedNews = async (req: Request, res: Response) => {
  const publishedNews = await News.find({
    publish: true,
  });
  res.status(200).json({
    success: true,
    message: "Successful",
    data: publishedNews,
  });
};

const getTotalNews = async (req: Request, res: Response) => {
  const news = await News.find();
  const totalNews = news.length;

  res.status(200).json({
    success: true,
    message: "Successful",
    data: totalNews,
  });
};

const getNewById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const news = await News.findById(id);
  if (news) {
    res.status(200).json({
      success: true,
      data: news,
      message: "Successful",
    });
  } else {
    res.status(400).json({
      success: false,
      message: "News not found",
    });
    return;
  }
};

const updateNews = async (req: Request, res: Response) => {
  const id = req.params.id;
  const error = validate(createNewsSchema, req.body);
  if (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
    return;
  }
  try {
    const newsToBeUpdated = await News.findById(id);
    if (!newsToBeUpdated) {
      res.status(400).json({
        success: false,
        message: "News does not exist",
      });
      return;
    }

    const data = await News.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // Log news update
    await logActivity(
      req.body.userId || data.createdBy,
      "UPDATE_NEWS",
      `News article "${data.newsTitle}" was updated`,
      req,
      data._id.toString(),
      "News"
    );

    if (data) {
      res.status(200).json({
        success: true,
        message: "News updated",
        data,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const deleteNews = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const news = await News.findById(id);
    if (!news) {
      res.status(400).json({
        success: false,
        message: "News does not exist",
      });
      return;
    } else {
      await news.remove();

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
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const trackNewsView = async (req: Request, res: Response) => {
  try {
    const { newsId } = req.params;
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

    if (!news) {
      return res
        .status(404)
        .json({ success: false, message: "News not found" });
    }

    // Get the current month's views
    const currentMonthViews =
      news.monthlyViews?.[currentYear]?.[currentMonth] || 0;

    res.status(200).json({
      success: true,
      message: "View recorded",
      views: news.views,
      currentMonthViews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error tracking view",
      error: error.message,
    });
  }
};

const getAllDashboardData = async (req: Request, res: Response) => {
  try {
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

    // Prepare response data
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
    res.status(500).json({
      success: false,
      message: "Error retrieving news statistics",
      error: error.message,
    });
  }
};

const getTopPerformingNewsBasedOnViews = async (
  req: Request,
  res: Response
) => {
  try {
    const topNews = await News.find().sort({ views: -1 }).limit(10); // Sort descending by views

    return res.status(200).json({ success: true, data: topNews });
  } catch (error) {
    console.error("Error fetching top news:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getMonthlyViews = async (req: Request, res: Response) => {
  try {
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

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching monthly views:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getMonthlyViewsByCategory = async (req: Request, res: Response) => {
  try {
    // Get month and year from query params or use current month/year
    const today = new Date();
    const month = parseInt(req.query.month as string) || today.getMonth() + 1;
    const year = parseInt(req.query.year as string) || today.getFullYear();

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

    return res.status(200).json({
      success: true,
      message: "Monthly views by category retrieved successfully",
      data: { month, year, categories: result },
    });
  } catch (error) {
    console.error("Error fetching monthly category views:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
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
  getAllDashboardData,
  getTopPerformingNewsBasedOnViews,
  getMonthlyViews,
  getMonthlyViewsByCategory,
};
