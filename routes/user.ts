import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  loginUser,
  modifyUserStatus,
  registerUser,
  getAllUsers,
  editUser,
} from "../controller/user";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/change-password", changePassword);
userRouter.post("/reset-password", forgotPassword);
userRouter.put("/modify-user-status/:userId", modifyUserStatus);
userRouter.get("/users", getAllUsers);
userRouter.put("/edit-user/:userId", editUser);

export { userRouter };
