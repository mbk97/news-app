import { compare, genSalt, hash } from "bcryptjs";
import Roles from "../../model/roles";
import User from "../../model/userModel";
import crypto from "crypto";
import { generateToken } from "../../utils";
import ActivityLog from "../../model/activityLogModel";
import { ApiError } from "../../utils/apiError";

const createUserService = async ({ fullname, email, roleName }) => {
  const userEmail = email.toLowerCase();
  const role = await Roles.findOne({
    roleName,
  });

  if (!role) throw new Error("Role does not exist");

  const mailExists = await User.findOne({
    email: userEmail,
  });

  if (mailExists) throw new ApiError(400, "User already exist");

  const defaultPassword = crypto.randomBytes(8).toString("hex");
  const salt = await genSalt(10);
  const hashedPassword = await hash(defaultPassword, salt);

  const user = await User.create({
    fullname,
    email: userEmail,
    roleName,
    password: hashedPassword,
  });

  return { user, defaultPassword };
};

const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.userStatus) throw new ApiError(400, "Invalid credentials");

  const isMatch = await compare(password, user.password);
  if (!isMatch) throw new ApiError(400, "Invalid email or password");

  const token = generateToken(user._id.toString());

  return { user, token };
};

const changePasswordService = async ({
  email,
  currentPassword,
  newPassword,
}) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) throw new ApiError(400, "User not found!");

  const isMatch = await compare(currentPassword, user.password);
  if (!isMatch) throw new ApiError(400, "Current password is incorrect.");

  // Hash new password
  const salt = await genSalt(10);
  const hashedNewPassword = await hash(newPassword, salt);

  // Update user's password
  user.password = hashedNewPassword;
  await user.save();

  return { user };
};

const resetPasswordService = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
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

  if (!matchedUser) throw new ApiError(400, "Invalid or expired token");

  // Hash the new password
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  // Update the user's password and clear reset fields
  matchedUser.password = hashedPassword;
  matchedUser.passwordResetToken = undefined;
  matchedUser.passwordResetExpires = undefined;
  await matchedUser.save();

  return {
    matchedUser,
  };
};

const forgotPasswordService = async ({ email }: { email: string }) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) throw new ApiError(400, "User does not exist");
  // Generate a secure reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const salt = await genSalt(10);
  const hashedResetToken = await hash(resetToken, salt);

  // Save the hashed token and expiration time to the user record
  user.passwordResetToken = hashedResetToken;
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // Token valid for 1 hour
  await user.save();
  // Send reset token via email

  return { user, resetToken };
};

const modifyUserStatusService = async (userId: string) => {
  const user = await User.findById(userId).select(
    "-password -createdAt -passwordResetExpires -passwordResetToken"
  );

  if (!user) throw new ApiError(400, "User does not exist");
  // Toggle userStatus
  user.userStatus = !user.userStatus;
  await user.save();

  return { user };
};

const getAllUsersService = async ({
  fullname,
  roleName,
}: {
  fullname: string;
  roleName: string;
}) => {
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

  return { users };
};

const editUserService = async ({
  userId,
  fullname,
  roleName,
}: {
  userId: string;
  fullname: string;
  roleName: string;
}) => {
  if (!fullname && !roleName)
    throw new ApiError(400, "At least one field is required");

  // Check if role exists if roleName is provided
  if (roleName) {
    const checkUserRole = await Roles.findOne({ roleName });
    if (!checkUserRole) throw new ApiError(400, "Role does not exist");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: { ...(fullname && { fullname }), ...(roleName && { roleName }) },
    },
    { new: true }
  ).select("-password -passwordResetToken -passwordResetExpires");

  if (!updatedUser) throw new ApiError(400, "User does not exist");

  return { updatedUser };
};

const auditLogService = async ({
  userId,
  startDate,
  endDate,
  action,
  page,
  limit,
}) => {
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
  // const pageNum = parseInt(page as string);
  // const limitNum = parseInt(limit as string);

  const pageNum = page;
  const limitNum = limit;
  const skip = (pageNum - 1) * limitNum;

  // Get total count for pagination
  const total = await ActivityLog.countDocuments(query);

  // Get activities from database with pagination
  const activities = await ActivityLog.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limitNum)
    .populate("userId", "fullname email");

  return {
    activities,
    total,
    pageNum,
    limitNum,
  };
};

const logoutService = async (userId: string) => {
  if (!userId) throw new ApiError(400, "User ID is required");

  const user = await User.findById(userId);

  if (!user) throw new ApiError(400, "User not found");

  return { user };
};

export {
  createUserService,
  loginUserService,
  changePasswordService,
  resetPasswordService,
  forgotPasswordService,
  modifyUserStatusService,
  getAllUsersService,
  editUserService,
  auditLogService,
  logoutService,
};
