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
} from "../controller/user";
import { authenticateUser } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/roles";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/change-password", authenticateUser, changePassword);
userRouter.post("/reset-password", forgotPassword);
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
  authorizeRoles("Admin"),
  logoutUser
);

export { userRouter };
