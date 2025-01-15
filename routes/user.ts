import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  loginUser,
  registerUser,
} from "../controller/user";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/change-password", changePassword);
userRouter.post("/reset-password", forgotPassword);

export { userRouter };
