import { Router } from "express";
import { loginUser, registerUser } from "../controller/user";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export { userRouter };
