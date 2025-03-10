import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  loginUser,
  modifyUserStatus,
  registerUser,
} from "../controller/user";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/change-password", changePassword);
userRouter.post("/reset-password", forgotPassword);
userRouter.put("/modify-user-status/:userId", modifyUserStatus);

export { userRouter };
