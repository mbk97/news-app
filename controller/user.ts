import { Response, Request } from "express";
import { compare, genSalt, hash } from "bcryptjs";
import User from "../model/userModel";
import { generateToken } from "../utils";
import crypto from "crypto";
import { sendEmail } from "../services/email";
import Roles from "../model/roles";
import ActivityLog from "../model/activityLogModel";
import { logActivity } from "../utils/logger";

const registerUser = async (req: Request, res: Response) => {
  const { fullname, email, roleName } = req.body;

  if (!fullname || !email || !roleName) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const userEmail = email.toLowerCase();

  try {
    const checkUserRole = await Roles.findOne({
      roleName,
    });

    if (!checkUserRole) {
      return res.status(400).json({
        message: "Role does not exist",
      });
    }

    const mailExists = await User.findOne({
      userEmail,
    });

    if (mailExists) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    const defaultPassword = crypto.randomBytes(8).toString("hex");
    const salt = await genSalt(10);
    const hashedPassword = await hash(defaultPassword, salt);

    const user = await User.create({
      fullname,
      email,
      roleName,
      password: hashedPassword,
    });

    if (user) {
      // Log user creation
      await logActivity(
        user._id.toString(),
        "CREATE_USER",
        `User ${fullname} was created with role ${roleName}`,
        req
      );

      const subject = "Welcome onboard";
      const text = ``;
      const html = `<html>
      <h5>Hello ${fullname}</h5>,
      Your account has been created successfully. <br />
      Here are your login details: Email: ${email}\nPassword: ${defaultPassword} <br />
      Please change your password after logging in. <br /> 
      Best regards, <br />
      Your Team.
     </html>`;

      await sendEmail(email, subject, text, html);

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
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userEmail = email.toLowerCase();
    const user = await User.findOne({
      userEmail,
    });

    if (!user) {
      return res.status(403).json({
        message: "User is not registered",
        success: false,
      });
    }

    // Check if user is restricted
    if (!user.userStatus) {
      return res.status(403).json({
        message:
          "Your account has been restricted. Please contact administrator.",
        success: false,
      });
    }

    if (await compare(password, user.password)) {
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
          token: generateToken(user._id.toString()),
        },
      });
    } else {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const changePassword = async (req: Request, res: Response) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    res.status(400).json({
      success: false,
      message: "Email, current password, and new password are required.",
    });

    return;
  }

  try {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    // Compare current password with stored hash
    const isMatch = await compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
      return;
    }

    // Hash new password
    const salt = await genSalt(10);
    const hashedNewPassword = await hash(newPassword, salt);

    // Update user's password
    user.password = hashedNewPassword;
    await user.save();

    // Log password change
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
      message: "Server error. Please try again later.",
    });
  }
};
const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  try {
    // Find the user by comparing the hashed token
    const users = await User.find({
      passwordResetExpires: { $gt: Date.now() },
    });

    let matchedUser: (typeof users)[0] | null = null;

    for (const user of users) {
      const isMatch = await compare(token, user.passwordResetToken);
      if (isMatch) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Hash the new password
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    // Update the user's password and clear reset fields
    matchedUser.password = hashedPassword;
    matchedUser.passwordResetToken = undefined;
    matchedUser.passwordResetExpires = undefined;
    await matchedUser.save();

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
    console.error("Error resetting password:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({
      success: false,
      message: "Email is required!",
    });
    return;
  }

  try {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User does not exist",
      });
      return;
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const salt = await genSalt(10);
    const hashedResetToken = await hash(resetToken, salt);

    // Save the hashed token and expiration time to the user record
    user.passwordResetToken = hashedResetToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // Token valid for 1 hour
    await user.save();
    // Send reset token via email

    const CLIENT_URL = "http://localhost:5173";
    // const CLIENT_URL = process.env.CLIENT_URL;

    // const CLIENT_URL =
    //   process.env.NODE_ENV === "development"
    //     ? "http://localhost:5173"
    //     : "https://news-admin-app-fe.vercel.app"; // Replace with your actual client URL

    const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;

    const subject = "Password Reset Request";
    const text = ``;
    const html = `
      <p>Hello ${user.fullname},</p>
      <p>You requested to reset your password. Please click the link below to set a new password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br>Your Team</p>
    `;

    await sendEmail(user.email, subject, text, html);

    // Log password reset request
    await logActivity(
      user._id.toString(),
      "RESET_PASSWORD",
      `User ${user.fullname} requested password reset`,
      req
    );

    return res.status(200).json({
      success: true,
      message: "Password reset email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const modifyUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "-password -createdAt -passwordResetExpires -passwordResetToken"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    // Toggle userStatus
    user.userStatus = !user.userStatus;
    await user.save();

    // Log user status change
    await logActivity(
      user._id.toString(),
      "UPDATE_USER",
      `User ${user.fullname}'s status changed to ${
        user.userStatus ? "active" : "inactive"
      }`,
      req
    );

    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error modifying user status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { fullname, roleName } = req.query;
    let query = {};

    if (fullname) {
      query = { ...query, fullname: { $regex: fullname, $options: "i" } };
    }

    if (roleName) {
      query = { ...query, roleName };
    }

    const users = await User.find(query).select(
      "-password -passwordResetToken -passwordResetExpires"
    );

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const editUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { fullname, roleName } = req.body;

    if (!fullname && !roleName) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required for update",
      });
    }

    // Check if role exists if roleName is provided
    if (roleName) {
      const checkUserRole = await Roles.findOne({ roleName });
      if (!checkUserRole) {
        return res.status(400).json({
          success: false,
          message: "Role does not exist",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: { ...(fullname && { fullname }), ...(roleName && { roleName }) },
      },
      { new: true }
    ).select("-password -passwordResetToken -passwordResetExpires");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

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
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
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
    let query = {};

    // Filter by user if userId is provided
    if (userId) {
      query = { ...query, userId };
    }

    // Filter by action if provided
    if (action) {
      query = { ...query, action };
    }

    // Filter by date range if provided
    if (startDate && endDate) {
      query = {
        ...query,
        timestamp: {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        },
      };
    }

    // Calculate pagination values
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await ActivityLog.countDocuments(query);

    // Get activities from database with pagination
    const activities = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("userId", "fullname email");

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
    console.error("Error fetching user activities:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

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
    console.error("Error logging out:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
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
