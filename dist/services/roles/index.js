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
exports.getAllUserUnderRoleService = exports.getAllRolesService = exports.deleteRoleService = exports.createRoleService = void 0;
const roles_1 = __importDefault(require("../../model/roles"));
const userModel_1 = __importDefault(require("../../model/userModel"));
const apiError_1 = require("../../utils/apiError");
const createRoleService = (roleName) => __awaiter(void 0, void 0, void 0, function* () {
    const existingRole = yield roles_1.default.findOne({ roleName });
    if (existingRole)
        throw new apiError_1.ApiError(400, "Role already exists");
    const newRole = yield roles_1.default.create({
        roleName,
    });
    return { newRole };
});
exports.createRoleService = createRoleService;
const deleteRoleService = (roleName) => __awaiter(void 0, void 0, void 0, function* () {
    const usersUnderRoleToBeDeleted = yield userModel_1.default.findById(roleName);
    return { usersUnderRoleToBeDeleted };
});
exports.deleteRoleService = deleteRoleService;
const getAllRolesService = () => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield roles_1.default.find();
    return { roles };
});
exports.getAllRolesService = getAllRolesService;
const getAllUserUnderRoleService = (roleName) => __awaiter(void 0, void 0, void 0, function* () {
    const usersUnderRole = yield userModel_1.default.find({ roleName });
    return { usersUnderRole };
});
exports.getAllUserUnderRoleService = getAllUserUnderRoleService;
//# sourceMappingURL=index.js.map