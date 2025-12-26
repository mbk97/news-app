"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutService = exports.auditLogService = exports.editUserService = exports.getAllUsersService = exports.modifyUserStatusService = exports.forgotPasswordService = exports.resetPasswordService = exports.changePasswordService = exports.loginUserService = exports.createUserService = void 0;
const bcryptjs_1 = require("bcryptjs");
const roles_1 = __importDefault(require("../../model/roles"));
const userModel_1 = __importDefault(require("../../model/userModel"));
const crypto_1 = __importDefault(require("crypto"));
const utils_1 = require("../../utils");
const activityLogModel_1 = __importDefault(require("../../model/activityLogModel"));
const apiError_1 = require("../../utils/apiError");
const createUserService = async ({ fullname, email, roleName }) => {
    const userEmail = email.toLowerCase();
    const role = await roles_1.default.findOne({
        roleName,
    });
    if (!role)
        throw new Error("Role does not exist");
    const mailExists = await userModel_1.default.findOne({
        email: userEmail,
    });
    if (mailExists)
        throw new apiError_1.ApiError(400, "User already exist");
    const defaultPassword = crypto_1.default.randomBytes(8).toString("hex");
    const salt = await (0, bcryptjs_1.genSalt)(10);
    const hashedPassword = await (0, bcryptjs_1.hash)(defaultPassword, salt);
    const user = await userModel_1.default.create({
        fullname,
        email: userEmail,
        roleName,
        password: hashedPassword,
    });
    return { user, defaultPassword };
};
exports.createUserService = createUserService;
const loginUserService = async ({ email, password }) => {
    const user = await userModel_1.default.findOne({ email: email.toLowerCase() });
    if (!user || !user.userStatus)
        throw new apiError_1.ApiError(400, "Invalid credentials");
    const isMatch = await (0, bcryptjs_1.compare)(password, user.password);
    if (!isMatch)
        throw new apiError_1.ApiError(400, "Invalid email or password");
    const token = (0, utils_1.generateToken)(user._id.toString());
    return { user, token };
};
exports.loginUserService = loginUserService;
const changePasswordService = async ({ email, currentPassword, newPassword, }) => {
    const user = await userModel_1.default.findOne({
        email: email.toLowerCase(),
    });
    if (!user)
        throw new apiError_1.ApiError(400, "User not found!");
    const isMatch = await (0, bcryptjs_1.compare)(currentPassword, user.password);
    if (!isMatch)
        throw new apiError_1.ApiError(400, "Current password is incorrect.");
    // Hash new password
    const salt = await (0, bcryptjs_1.genSalt)(10);
    const hashedNewPassword = await (0, bcryptjs_1.hash)(newPassword, salt);
    // Update user's password
    user.password = hashedNewPassword;
    await user.save();
    return { user };
};
exports.changePasswordService = changePasswordService;
const resetPasswordService = async ({ token, password, }) => {
    // Find the user by comparing the hashed token
    const users = await userModel_1.default.find({
        passwordResetExpires: { $gt: Date.now() },
    });
    let matchedUser = null;
    for (const user of users) {
        const isMatch = await (0, bcryptjs_1.compare)(token, user.passwordResetToken);
        if (isMatch) {
            matchedUser = user;
            break;
        }
    }
    if (!matchedUser)
        throw new apiError_1.ApiError(400, "Invalid or expired token");
    // Hash the new password
    const salt = await (0, bcryptjs_1.genSalt)(10);
    const hashedPassword = await (0, bcryptjs_1.hash)(password, salt);
    // Update the user's password and clear reset fields
    matchedUser.password = hashedPassword;
    matchedUser.passwordResetToken = undefined;
    matchedUser.passwordResetExpires = undefined;
    await matchedUser.save();
    return {
        matchedUser,
    };
};
exports.resetPasswordService = resetPasswordService;
const forgotPasswordService = async ({ email }) => {
    const user = await userModel_1.default.findOne({
        email: email.toLowerCase(),
    });
    if (!user)
        throw new apiError_1.ApiError(400, "User does not exist");
    // Generate a secure reset token
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    const salt = await (0, bcryptjs_1.genSalt)(10);
    const hashedResetToken = await (0, bcryptjs_1.hash)(resetToken, salt);
    // Save the hashed token and expiration time to the user record
    user.passwordResetToken = hashedResetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // Token valid for 1 hour
    await user.save();
    // Send reset token via email
    return { user, resetToken };
};
exports.forgotPasswordService = forgotPasswordService;
const modifyUserStatusService = async (userId) => {
    const user = await userModel_1.default.findById(userId).select("-password -createdAt -passwordResetExpires -passwordResetToken");
    if (!user)
        throw new apiError_1.ApiError(400, "User does not exist");
    // Toggle userStatus
    user.userStatus = !user.userStatus;
    await user.save();
    return { user };
};
exports.modifyUserStatusService = modifyUserStatusService;
const getAllUsersService = async ({ fullname, roleName, }) => {
    let query = {};
    if (fullname) {
        query = { ...query, fullname: { $regex: fullname, $options: "i" } };
    }
    if (roleName) {
        query = { ...query, roleName };
    }
    const users = await userModel_1.default.find(query).select("-password -passwordResetToken -passwordResetExpires");
    return { users };
};
exports.getAllUsersService = getAllUsersService;
const editUserService = async ({ userId, fullname, roleName, }) => {
    if (!fullname && !roleName)
        throw new apiError_1.ApiError(400, "At least one field is required");
    // Check if role exists if roleName is provided
    if (roleName) {
        const checkUserRole = await roles_1.default.findOne({ roleName });
        if (!checkUserRole)
            throw new apiError_1.ApiError(400, "Role does not exist");
    }
    const updatedUser = await userModel_1.default.findByIdAndUpdate(userId, {
        $set: { ...(fullname && { fullname }), ...(roleName && { roleName }) },
    }, { new: true }).select("-password -passwordResetToken -passwordResetExpires");
    if (!updatedUser)
        throw new apiError_1.ApiError(400, "User does not exist");
    return { updatedUser };
};
exports.editUserService = editUserService;
const auditLogService = async ({ userId, startDate, endDate, action, page, limit, }) => {
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
                $gte: new Date(startDate),
                $lte: new Date(endDate),
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
    const total = await activityLogModel_1.default.countDocuments(query);
    // Get activities from database with pagination
    const activities = await activityLogModel_1.default.find(query)
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
exports.auditLogService = auditLogService;
const logoutService = async (userId) => {
    if (!userId)
        throw new apiError_1.ApiError(400, "User ID is required");
    const user = await userModel_1.default.findById(userId);
    if (!user)
        throw new apiError_1.ApiError(400, "User not found");
    return { user };
};
exports.logoutService = logoutService;
//# sourceMappingURL=index.js.map