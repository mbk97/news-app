import rateLimit from "express-rate-limit";

const resetPasswordRateLimitter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 1, // Max 1 requests per IP in 15 mins
  handler: (req, res, next, options) => {
    const retryAfter = Math.ceil(options.windowMs / 1000); // seconds
    res.status(options.statusCode).json({
      message: `Too many requests. Please try again in ${retryAfter} seconds.`,
    });
  },
});

export { resetPasswordRateLimitter };
