"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserUnderRoleService = exports.getAllRolesService = exports.deleteRoleService = exports.createRoleService = void 0;
const roles_1 = __importDefault(require("../../model/roles"));
const userModel_1 = __importDefault(require("../../model/userModel"));
const apiError_1 = require("../../utils/apiError");
const createRoleService = async (roleName) => {
    const existingRole = await roles_1.default.findOne({ roleName });
    if (existingRole)
        throw new apiError_1.ApiError(400, "Role already exists");
    const newRole = await roles_1.default.create({
        roleName,
    });
    return { newRole };
};
exports.createRoleService = createRoleService;
const deleteRoleService = async (roleName) => {
    const usersUnderRoleToBeDeleted = await userModel_1.default.findById(roleName);
    return { usersUnderRoleToBeDeleted };
};
exports.deleteRoleService = deleteRoleService;
const getAllRolesService = async () => {
    const roles = await roles_1.default.find();
    return { roles };
};
exports.getAllRolesService = getAllRolesService;
const getAllUserUnderRoleService = async (roleName) => {
    const usersUnderRole = await userModel_1.default.find({ roleName });
    return { usersUnderRole };
};
exports.getAllUserUnderRoleService = getAllUserUnderRoleService;
//# sourceMappingURL=index.js.map