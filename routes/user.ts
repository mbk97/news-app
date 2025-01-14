import { Router } from "express";
import { changePassword, loginUser, registerUser } from "../controller/user";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/change-password", changePassword);

export { userRouter };
