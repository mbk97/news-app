import { createRoleValidator } from "../../validator/roles";

const createRoleValidatorMiddleware = (req, res, next) => {
  const validationError = createRoleValidator(req.body);
  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }
  next();
};

export { createRoleValidatorMiddleware };
