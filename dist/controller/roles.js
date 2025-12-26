"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersUnderAParticularRole = exports.getAllRoles = exports.deleteRole = exports.createRole = void 0;
const roles_1 = require("../services/roles");
const apiError_1 = require("../utils/apiError");
const createRole = async (req, res) => {
    const { roleName } = req.body;
    try {
        const { newRole } = await (0, roles_1.createRoleService)(roleName);
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
};
exports.createRole = createRole;
const deleteRole = async (req, res) => {
    const { roleName } = req.body;
    const { usersUnderRoleToBeDeleted } = await (0, roles_1.deleteRoleService)(roleName);
    res.status(200).json({
        message: "success",
        data: usersUnderRoleToBeDeleted,
    });
};
exports.deleteRole = deleteRole;
const getAllRoles = async (req, res) => {
    try {
        const { roles } = await (0, roles_1.getAllRolesService)();
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
};
exports.getAllRoles = getAllRoles;
const getAllUsersUnderAParticularRole = async (req, res) => {
    const { roleName } = req.params;
    const { usersUnderRole } = await (0, roles_1.getAllUserUnderRoleService)(roleName);
    res.status(200).json({
        message: "success",
        data: usersUnderRole,
    });
};
exports.getAllUsersUnderAParticularRole = getAllUsersUnderAParticularRole;
//# sourceMappingURL=roles.js.map