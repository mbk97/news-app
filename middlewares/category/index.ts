import { createCategoryValidator } from "../../validator/category";

const createCategoryValidatorMiddleware = (req, res, next) => {
  const validationError = createCategoryValidator(req.body);
  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }
  next();
};

export { createCategoryValidatorMiddleware };
