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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersUnderAParticularRole = exports.getAllRoles = exports.deleteRole = exports.createRole = void 0;
const roles_1 = require("../services/roles");
const apiError_1 = require("../utils/apiError");
const createRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roleName } = req.body;
    try {
        const { newRole } = yield (0, roles_1.createRoleService)(roleName);
        return res.status(201).json({
            message: "Role created successfully",
            role: newRole,
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
});
exports.createRole = createRole;
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roleName } = req.body;
    const { usersUnderRoleToBeDeleted } = yield (0, roles_1.deleteRoleService)(roleName);
    res.status(200).json({
        message: "success",
        data: usersUnderRoleToBeDeleted,
    });
});
exports.deleteRole = deleteRole;
const getAllRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roles } = yield (0, roles_1.getAllRolesService)();
        res.status(200).json({
            success: true,
            data: roles,
        });
    }
    catch (error) {
        const { message, statusCode, success } = (0, apiError_1.customErrorHandler)(error);
        res.status(statusCode).json({
            success: success,
            message,
        });
    }
});
exports.getAllRoles = getAllRoles;
const getAllUsersUnderAParticularRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roleName } = req.params;
    const { usersUnderRole } = yield (0, roles_1.getAllUserUnderRoleService)(roleName);
    res.status(200).json({
        message: "success",
        data: usersUnderRole,
    });
});
exports.getAllUsersUnderAParticularRole = getAllUsersUnderAParticularRole;
//# sourceMappingURL=roles.js.map