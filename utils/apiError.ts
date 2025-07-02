export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const customErrorHandler = (error) => {
  const statusCode =
    error instanceof ApiError && error.statusCode ? error.statusCode : 500;
  const message =
    error instanceof Error
      ? error.message
      : "Internal Server Error. Please try again later.";

  return {
    statusCode,
    success: false,
    message,
  };
};
