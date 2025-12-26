"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userActivityLog = exports.editUser = exports.getAllUsers = exports.modifyUserStatus = exports.forgotPassword = exports.resetPassword = exports.changePassword = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const utils_1 = require("../utils");
const logger_1 = require("../utils/logger");
const inspector_1 = require("inspector");
const auth_1 = require("../services/auth");
const email_1 = require("../services/email");
const apiError_1 = require("../utils/apiError");
const registerUser = async (req, res) => {
    const { fullname, email, roleName } = req.body;
    try {
        const { user, defaultPassword } = await (0, auth_1.createUserService)({
            fullname,
            email,
            roleName,
        });
        await Promise.all([
            (0, logger_1.logActivity)(user._id.toString(), "CREATE_USER", `User ${fullname} was created with role ${roleName}`, req),
            (0, email_1.sendWelcome)({ fullname, email, password: defaultPassword }),
        ]);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                fullname: user.fullname,
                email: user.email,
                role: user.roleName,
                token: (0, utils_1.generateToken)(user._id.toString()), // Convert ObjectId to string
            },
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { user, token } = await (0, auth_1.loginUserService)({
            email,
            password,
        });
        // Log the login activity
        await (0, logger_1.logActivity)(user._id.toString(), "LOGIN", `User ${user.fullname} logged in`, req);
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
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.loginUser = loginUser;
const changePassword = async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    try {
        const { user } = await (0, auth_1.changePasswordService)({
            email,
            currentPassword,
            newPassword,
        });
        await (0, logger_1.logActivity)(user._id.toString(), "CHANGE_PASSWORD", `User ${user.fullname} changed their password`, req);
        return res.status(200).json({
            success: true,
            message: "Password updated successfully.",
        });
    }
    catch (error) {
        inspector_1.console.error("Error changing default password:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error. Please try again later.",
        });
    }
};
exports.changePassword = changePassword;
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const { matchedUser } = await (0, auth_1.resetPasswordService)({
            token,
            password,
        });
        // Log password reset
        await (0, logger_1.logActivity)(matchedUser._id.toString(), "RESET_PASSWORD_SUCCESS", `User ${matchedUser.fullname} successfully reset their password`, req);
        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully",
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.resetPassword = resetPassword;
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const { user, resetToken } = await (0, auth_1.forgotPasswordService)({
            email,
        });
        const CLIENT_URL = process.env.CLIENT_URL;
        const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;
        await Promise.all([
            (0, logger_1.logActivity)(user._id.toString(), "RESET_PASSWORD", `User ${user.fullname} requested password reset`, req),
            (0, email_1.sendResetPasswordEmail)({ user, resetUrl }),
        ]);
        return res.status(200).json({
            success: true,
            message: "Password reset email sent. Please check your inbox.",
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.forgotPassword = forgotPassword;
const modifyUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { user } = await (0, auth_1.modifyUserStatusService)(userId);
        await (0, logger_1.logActivity)(user._id.toString(), "UPDATE_USER", `User ${user.fullname}'s status changed to ${user.userStatus ? "active" : "inactive"}`, req);
        return res.status(201).json({
            success: true,
            message: "User status updated successfully",
            data: user,
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.modifyUserStatus = modifyUserStatus;
const getAllUsers = async (req, res) => {
    try {
        const { fullname, roleName } = req.body;
        const { users } = await (0, auth_1.getAllUsersService)({ fullname, roleName });
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users,
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.getAllUsers = getAllUsers;
const editUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { fullname, roleName } = req.body;
        const reqPayload = {
            userId,
            fullname,
            roleName,
        };
        const { updatedUser } = await (0, auth_1.editUserService)(reqPayload);
        // Log user update
        await (0, logger_1.logActivity)(updatedUser._id.toString(), "UPDATE_USER", `User ${updatedUser.fullname}'s profile was updated`, req);
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.editUser = editUser;
const userActivityLog = async (req, res) => {
    try {
        const { userId, startDate, endDate, action, page = 1, limit = 10, } = req.query;
        const { activities, total, pageNum, limitNum } = await (0, auth_1.auditLogService)({
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
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.userActivityLog = userActivityLog;
const logoutUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const { user } = await (0, auth_1.logoutService)(userId);
        // Log logout activity
        await (0, logger_1.logActivity)(userId, "LOGOUT", `User ${user.fullname} logged out`, req);
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
};
exports.logoutUser = logoutUser;
//# sourceMappingURL=user.js.map