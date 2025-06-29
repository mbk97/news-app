import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  loginUser,
  modifyUserStatus,
  registerUser,
  getAllUsers,
  editUser,
  userActivityLog,
  logoutUser,
  resetPassword,
} from "../controller/user";
import { authenticateUser } from "../middlewares/authenticator";
import {
  changePasswordValidatorMiddleware,
  passwordValidatorMiddleware,
  loginRouteValidatorMiddleware,
  registerUserValidatorMiddleware,
  forgotpasswordValidatorMiddleware,
} from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/roleBasedPermission";
import { resetPasswordRateLimitter } from "../middlewares/rate-limiter/authRateLimiter";

const userRouter = Router();

userRouter.post("/register", registerUserValidatorMiddleware, registerUser);
userRouter.post("/login", loginRouteValidatorMiddleware, loginUser);
userRouter.post(
  "/change-password",
  authenticateUser,
  changePasswordValidatorMiddleware,
  resetPasswordRateLimitter,
  changePassword
);
userRouter.post(
  "/reset-password",
  resetPasswordRateLimitter,
  forgotpasswordValidatorMiddleware,
  forgotPassword
);
userRouter.post(
  "/reset-password/:token",
  passwordValidatorMiddleware,
  resetPassword
);
userRouter.put(
  "/modify-user-status/:userId",
  authenticateUser,
  authorizeRoles("Admin"),
  modifyUserStatus
);
userRouter.get("/users", authenticateUser, getAllUsers);
userRouter.put(
  "/edit-user/:userId",
  authenticateUser,
  authorizeRoles("Admin"),
  editUser
);
userRouter.get(
  "/activity-logs",
  authenticateUser,
  authorizeRoles("Admin"),
  userActivityLog
);
userRouter.post(
  "/logout",
  authenticateUser,
  // authorizeRoles("Admin"),
  logoutUser
);

export { userRouter };
