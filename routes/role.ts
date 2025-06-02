import { Router } from "express";
import {
  createRole,
  getAllRoles,
  getAllUsersUnderAParticularRole,
} from "../controller/roles";
import { authenticateUser } from "../middlewares/auth";
import { authorizeRoles } from "../middlewares/roles";

const roleRouter = Router();

roleRouter.post(
  "/create-role",
  authenticateUser,
  authorizeRoles("Admin"),
  createRole
);
roleRouter.delete(
  "/delete-role/:id",
  authenticateUser,
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
