"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRouter = void 0;
const express_1 = require("express");
const roles_1 = require("../controller/roles");
const authenticator_1 = require("../middlewares/authenticator");
const roles_2 = require("../middlewares/roles");
const roleBasedPermission_1 = require("../middlewares/roleBasedPermission");
const roleRouter = (0, express_1.Router)();
exports.roleRouter = roleRouter;
roleRouter.post("/create-role", authenticator_1.authenticateUser, roles_2.createRoleValidatorMiddleware, (0, roleBasedPermission_1.authorizeRoles)("Admin"), roles_1.createRole);
roleRouter.delete("/delete-role/:id", authenticator_1.authenticateUser, roles_2.createRoleValidatorMiddleware, (0, roleBasedPermission_1.authorizeRoles)("Admin"), roles_1.createRole);
roleRouter.get("/roles", authenticator_1.authenticateUser, (0, roleBasedPermission_1.authorizeRoles)("Admin"), roles_1.getAllRoles);
roleRouter.get("/users-roles/:roleName", authenticator_1.authenticateUser, (0, roleBasedPermission_1.authorizeRoles)("Admin"), roles_1.getAllUsersUnderAParticularRole);
//# sourceMappingURL=role.js.map