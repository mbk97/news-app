import { Response, Request } from "express";
import { generateToken } from "../utils";
import { logActivity } from "../utils/logger";
import { console } from "inspector";
import {
  auditLogService,
  changePasswordService,
  createUserService,
  editUserService,
  forgotPasswordService,
  getAllUsersService,
  loginUserService,
  logoutService,
  modifyUserStatusService,
  resetPasswordService,
} from "../services/auth";
import { sendResetPasswordEmail, sendWelcome } from "../services/email";
import { customErrorHandler } from "../utils/apiError";

const registerUser = async (req: Request, res: Response) => {
  const { fullname, email, roleName } = req.body;
  try {
    const { user, defaultPassword } = await createUserService({
      fullname,
      email,
      roleName,
    });
    await Promise.all([
      logActivity(
        user._id.toString(),
        "CREATE_USER",
        `User ${fullname} was created with role ${roleName}`,
        req
      ),
      sendWelcome({ fullname, email, password: defaultPassword }),
    ]);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        fullname: user.fullname,
        email: user.email,
        role: user.roleName,
        token: generateToken(user._id.toString()), // Convert ObjectId to string
      },
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { user, token } = await loginUserService({
      email,
      password,
    });

    // Log the login activity
    await logActivity(
      user._id.toString(),
      "LOGIN",
      `User ${user.fullname} logged in`,
      req
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.roleName,
        token: token,
      },
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const changePassword = async (req: Request, res: Response) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const { user } = await changePasswordService({
      email,
      currentPassword,
      newPassword,
    });

    await logActivity(
      user._id.toString(),
      "CHANGE_PASSWORD",
      `User ${user.fullname} changed their password`,
      req
    );
    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Error changing default password:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error. Please try again later.",
    });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const { matchedUser } = await resetPasswordService({
      token,
      password,
    });
    // Log password reset
    await logActivity(
      matchedUser._id.toString(),
      "RESET_PASSWORD_SUCCESS",
      `User ${matchedUser.fullname} successfully reset their password`,
      req
    );

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const { user, resetToken } = await forgotPasswordService({
      email,
    });

    const CLIENT_URL = process.env.CLIENT_URL;
    const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;

    await Promise.all([
      logActivity(
        user._id.toString(),
        "RESET_PASSWORD",
        `User ${user.fullname} requested password reset`,
        req
      ),
      sendResetPasswordEmail({ user, resetUrl }),
    ]);
    return res.status(200).json({
      success: true,
      message: "Password reset email sent. Please check your inbox.",
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const modifyUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const { user } = await modifyUserStatusService(userId);

    await logActivity(
      user._id.toString(),
      "UPDATE_USER",
      `User ${user.fullname}'s status changed to ${
        user.userStatus ? "active" : "inactive"
      }`,
      req
    );
    return res.status(201).json({
      success: true,
      message: "User status updated successfully",
      data: user,
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { fullname, roleName } = req.body;
    const { users } = await getAllUsersService({ fullname, roleName });
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const editUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { fullname, roleName } = req.body;

    const reqPayload = {
      userId,
      fullname,
      roleName,
    };

    const { updatedUser } = await editUserService(reqPayload);

    // Log user update
    await logActivity(
      updatedUser._id.toString(),
      "UPDATE_USER",
      `User ${updatedUser.fullname}'s profile was updated`,
      req
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const userActivityLog = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      startDate,
      endDate,
      action,
      page = 1,
      limit = 10,
    } = req.query;
    const { activities, total, pageNum, limitNum } = await auditLogService({
      userId,
      startDate,
      endDate,
      action,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "User activities retrieved successfully",
      data: activities,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const { user } = await logoutService(userId);

    // Log logout activity
    await logActivity(
      userId,
      "LOGOUT",
      `User ${user.fullname} logged out`,
      req
    );

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  resetPassword,
  forgotPassword,
  modifyUserStatus,
  getAllUsers,
  editUser,
  userActivityLog,
};
