// middleware/errorHandler.ts
import { Request, Response } from "express";
import { ApiError } from "../../utils/apiError";

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
