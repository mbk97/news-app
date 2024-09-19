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

export { createNews };
