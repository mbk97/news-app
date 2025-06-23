import {
  changePasswordValidator,
  forgotPasswordValidator,
  passwordValidator,
  userLoginValidator,
  userRegistrationValidator,
} from "../../validator/auth";

const registerUserValidatorMiddleware = (req, res, next) => {
  const validationError = userRegistrationValidator(req.body);
  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  next();
};

const loginRouteValidatorMiddleware = (req, res, next) => {
  const validationError = userLoginValidator(req.body);
  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  next();
};

const changePasswordValidatorMiddleware = (req, res, next) => {
  const validationError = changePasswordValidator(req.body);
  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  next();
};

const passwordValidatorMiddleware = (req, res, next) => {
  const validationError = passwordValidator(req.body);
  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }
  next();
};
const forgotpasswordValidatorMiddleware = (req, res, next) => {
  const validationError = forgotPasswordValidator(req.body);
  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }
  next();
};

export {
  registerUserValidatorMiddleware,
  loginRouteValidatorMiddleware,
  changePasswordValidatorMiddleware,
  passwordValidatorMiddleware,
  forgotpasswordValidatorMiddleware,
};
