"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_1 = require("../controller/user");
const authenticator_1 = require("../middlewares/authenticator");
const auth_1 = require("../middlewares/auth");
const roleBasedPermission_1 = require("../middlewares/roleBasedPermission");
const authRateLimiter_1 = require("../middlewares/rate-limiter/authRateLimiter");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
userRouter.post("/register", auth_1.registerUserValidatorMiddleware, user_1.registerUser);
userRouter.post("/login", auth_1.loginRouteValidatorMiddleware, user_1.loginUser);
userRouter.post("/change-password", authenticator_1.authenticateUser, auth_1.changePasswordValidatorMiddleware, authRateLimiter_1.resetPasswordRateLimitter, user_1.changePassword);
userRouter.post("/reset-password", authRateLimiter_1.resetPasswordRateLimitter, auth_1.forgotpasswordValidatorMiddleware, user_1.forgotPassword);
userRouter.post("/reset-password/:token", auth_1.passwordValidatorMiddleware, user_1.resetPassword);
userRouter.put("/modify-user-status/:userId", authenticator_1.authenticateUser, (0, roleBasedPermission_1.authorizeRoles)("Admin"), user_1.modifyUserStatus);
userRouter.get("/users", authenticator_1.authenticateUser, user_1.getAllUsers);
userRouter.put("/edit-user/:userId", authenticator_1.authenticateUser, (0, roleBasedPermission_1.authorizeRoles)("Admin"), user_1.editUser);
userRouter.get("/activity-logs", authenticator_1.authenticateUser, (0, roleBasedPermission_1.authorizeRoles)("Admin"), user_1.userActivityLog);
userRouter.post("/logout", authenticator_1.authenticateUser, 
// authorizeRoles("Admin"),
user_1.logoutUser);
//# sourceMappingURL=user.js.map