import { Response, Request } from "express";
import { compare, genSalt, hash } from "bcryptjs";
import User from "../model/userModel";
import { generateToken } from "../utils";
import crypto from "crypto";
import { sendEmail } from "../services/email";
import Roles from "../model/roles";

const registerUser = async (req: Request, res: Response) => {
  const { fullname, email, roleName } = req.body;

  if (!fullname || !email || !roleName) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

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
      email,
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
    const user = await User.findOne({ email });

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

    // Replace /reset-password/${resetToken} with your frontend reset password page.
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${resetToken}`;

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

export {
  registerUser,
  loginUser,
  changePassword,
  forgotPassword,
  modifyUserStatus,
  getAllUsers,
  editUser,
};
