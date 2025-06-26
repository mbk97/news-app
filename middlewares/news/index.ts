import { createNewsValidator } from "../../validator/news";

const createNewsValidatorMiddleware = (req, res, next) => {
  const validationError = createNewsValidator(req.body);
  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }
  next();
};

export { createNewsValidatorMiddleware };
