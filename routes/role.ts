import { Router } from "express";
import {
  createRole,
  getAllRoles,
  getAllUsersUnderAParticularRole,
} from "../controller/roles";
import { authenticateUser } from "../middlewares/authenticator";
import { createRoleValidatorMiddleware } from "../middlewares/roles";
import { authorizeRoles } from "../middlewares/roleBasedPermission";

const roleRouter = Router();

roleRouter.post(
  "/create-role",
  authenticateUser,
  createRoleValidatorMiddleware,
  authorizeRoles("Admin"),
  createRole
);
roleRouter.delete(
  "/delete-role/:id",
  authenticateUser,
  createRoleValidatorMiddleware,
  authorizeRoles("Admin"),
  createRole
);
roleRouter.get(
  "/roles",
  authenticateUser,
  authorizeRoles("Admin"),
  getAllRoles
);
roleRouter.get(
  "/users-roles/:roleName",
  authenticateUser,
  authorizeRoles("Admin"),
  getAllUsersUnderAParticularRole
);

export { roleRouter };
