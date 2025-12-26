"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const createUserService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ fullname, email, roleName }) {
    const userEmail = email.toLowerCase();
    const role = yield roles_1.default.findOne({
        roleName,
    });
    if (!role)
        throw new Error("Role does not exist");
    const mailExists = yield userModel_1.default.findOne({
        email: userEmail,
    });
    if (mailExists)
        throw new apiError_1.ApiError(400, "User already exist");
    const defaultPassword = crypto_1.default.randomBytes(8).toString("hex");
    const salt = yield (0, bcryptjs_1.genSalt)(10);
    const hashedPassword = yield (0, bcryptjs_1.hash)(defaultPassword, salt);
    const user = yield userModel_1.default.create({
        fullname,
        email: userEmail,
        roleName,
        password: hashedPassword,
    });
    return { user, defaultPassword };
});
exports.createUserService = createUserService;
const loginUserService = (_b) => __awaiter(void 0, [_b], void 0, function* ({ email, password }) {
    const user = yield userModel_1.default.findOne({ email: email.toLowerCase() });
    if (!user || !user.userStatus)
        throw new apiError_1.ApiError(400, "Invalid credentials");
    const isMatch = yield (0, bcryptjs_1.compare)(password, user.password);
    if (!isMatch)
        throw new apiError_1.ApiError(400, "Invalid email or password");
    const token = (0, utils_1.generateToken)(user._id.toString());
    return { user, token };
});
exports.loginUserService = loginUserService;
const changePasswordService = (_c) => __awaiter(void 0, [_c], void 0, function* ({ email, currentPassword, newPassword, }) {
    const user = yield userModel_1.default.findOne({
        email: email.toLowerCase(),
    });
    if (!user)
        throw new apiError_1.ApiError(400, "User not found!");
    const isMatch = yield (0, bcryptjs_1.compare)(currentPassword, user.password);
    if (!isMatch)
        throw new apiError_1.ApiError(400, "Current password is incorrect.");
    // Hash new password
    const salt = yield (0, bcryptjs_1.genSalt)(10);
    const hashedNewPassword = yield (0, bcryptjs_1.hash)(newPassword, salt);
    // Update user's password
    user.password = hashedNewPassword;
    yield user.save();
    return { user };
});
exports.changePasswordService = changePasswordService;
const resetPasswordService = (_d) => __awaiter(void 0, [_d], void 0, function* ({ token, password, }) {
    // Find the user by comparing the hashed token
    const users = yield userModel_1.default.find({
        passwordResetExpires: { $gt: Date.now() },
    });
    let matchedUser = null;
    for (const user of users) {
        const isMatch = yield (0, bcryptjs_1.compare)(token, user.passwordResetToken);
        if (isMatch) {
            matchedUser = user;
            break;
        }
    }
    if (!matchedUser)
        throw new apiError_1.ApiError(400, "Invalid or expired token");
    // Hash the new password
    const salt = yield (0, bcryptjs_1.genSalt)(10);
    const hashedPassword = yield (0, bcryptjs_1.hash)(password, salt);
    // Update the user's password and clear reset fields
    matchedUser.password = hashedPassword;
    matchedUser.passwordResetToken = undefined;
    matchedUser.passwordResetExpires = undefined;
    yield matchedUser.save();
    return {
        matchedUser,
    };
});
exports.resetPasswordService = resetPasswordService;
const forgotPasswordService = (_e) => __awaiter(void 0, [_e], void 0, function* ({ email }) {
    const user = yield userModel_1.default.findOne({
        email: email.toLowerCase(),
    });
    if (!user)
        throw new apiError_1.ApiError(400, "User does not exist");
    // Generate a secure reset token
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    const salt = yield (0, bcryptjs_1.genSalt)(10);
    const hashedResetToken = yield (0, bcryptjs_1.hash)(resetToken, salt);
    // Save the hashed token and expiration time to the user record
    user.passwordResetToken = hashedResetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // Token valid for 1 hour
    yield user.save();
    // Send reset token via email
    return { user, resetToken };
});
exports.forgotPasswordService = forgotPasswordService;
const modifyUserStatusService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(userId).select("-password -createdAt -passwordResetExpires -passwordResetToken");
    if (!user)
        throw new apiError_1.ApiError(400, "User does not exist");
    // Toggle userStatus
    user.userStatus = !user.userStatus;
    yield user.save();
    return { user };
});
exports.modifyUserStatusService = modifyUserStatusService;
const getAllUsersService = (_f) => __awaiter(void 0, [_f], void 0, function* ({ fullname, roleName, }) {
    let query = {};
    if (fullname) {
        query = Object.assign(Object.assign({}, query), { fullname: { $regex: fullname, $options: "i" } });
    }
    if (roleName) {
        query = Object.assign(Object.assign({}, query), { roleName });
    }
    const users = yield userModel_1.default.find(query).select("-password -passwordResetToken -passwordResetExpires");
    return { users };
});
exports.getAllUsersService = getAllUsersService;
const editUserService = (_g) => __awaiter(void 0, [_g], void 0, function* ({ userId, fullname, roleName, }) {
    if (!fullname && !roleName)
        throw new apiError_1.ApiError(400, "At least one field is required");
    // Check if role exists if roleName is provided
    if (roleName) {
        const checkUserRole = yield roles_1.default.findOne({ roleName });
        if (!checkUserRole)
            throw new apiError_1.ApiError(400, "Role does not exist");
    }
    const updatedUser = yield userModel_1.default.findByIdAndUpdate(userId, {
        $set: Object.assign(Object.assign({}, (fullname && { fullname })), (roleName && { roleName })),
    }, { new: true }).select("-password -passwordResetToken -passwordResetExpires");
    if (!updatedUser)
        throw new apiError_1.ApiError(400, "User does not exist");
    return { updatedUser };
});
exports.editUserService = editUserService;
const auditLogService = (_h) => __awaiter(void 0, [_h], void 0, function* ({ userId, startDate, endDate, action, page, limit, }) {
    let query = {};
    // Filter by user if userId is provided
    if (userId) {
        query = Object.assign(Object.assign({}, query), { userId });
    }
    // Filter by action if provided
    if (action) {
        query = Object.assign(Object.assign({}, query), { action });
    }
    // Filter by date range if provided
    if (startDate && endDate) {
        query = Object.assign(Object.assign({}, query), { timestamp: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            } });
    }
    // Calculate pagination values
    // const pageNum = parseInt(page as string);
    // const limitNum = parseInt(limit as string);
    const pageNum = page;
    const limitNum = limit;
    const skip = (pageNum - 1) * limitNum;
    // Get total count for pagination
    const total = yield activityLogModel_1.default.countDocuments(query);
    // Get activities from database with pagination
    const activities = yield activityLogModel_1.default.find(query)
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
});
exports.auditLogService = auditLogService;
const logoutService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId)
        throw new apiError_1.ApiError(400, "User ID is required");
    const user = yield userModel_1.default.findById(userId);
    if (!user)
        throw new apiError_1.ApiError(400, "User not found");
    return { user };
});
exports.logoutService = logoutService;
//# sourceMappingURL=index.js.map