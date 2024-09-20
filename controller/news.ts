import { Response, Request } from "express";
import { createNewsSchema, validate } from "../utils/validation";
import News from "../model/newsModel";

const createNews = async (req: Request, res: Response) => {
  const { newsTitle, newsBody, createdBy, newsImage, category } = req.body;

  const error = validate(createNewsSchema, req.body);

  if (error) {
    res.status(400).json({
      message: error,
    });
    return;
  }

  try {
    const freshNews = await News.create({
      newsTitle,
      newsBody,
      newsImage,
      createdBy,
      category,
    });

    if (freshNews) {
      res.status(201).json({
        message: "News successfully created",
        data: {
          freshNews,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllNews = async (req: Request, res: Response) => {
  const news = await News.find();
  res.status(200).json({
    data: news,
    message: "Successful",
  });
};

const getNewById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const news = await News.findById(id);
  if (news) {
    res.status(200).json({
      data: news,
      message: "Successful",
    });
  } else {
    res.status(400).json({
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
      message: error,
    });
    return;
  }
  try {
    const newsToBeUpdated = await News.findById(id);
    if (!newsToBeUpdated) {
      res.status(400).json({
        message: "News does not exist",
      });
      return;
    }

    const data = await News.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (data) {
      res.status(200).json({
        message: "News updated",
        data,
      });
    }
  } catch (error) {
    res.status(500).json({
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
        message: "News does not exist",
      });
      return;
    } else {
      await news.remove();
      res.status(200).json({ message: "News deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export { createNews, getAllNews, updateNews, getNewById, deleteNews };
