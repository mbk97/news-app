import { Router } from "express";
import {
  createRole,
  getAllRoles,
  getAllUsersUnderAParticularRole,
} from "../controller/roles";

const roleRouter = Router();

roleRouter.post("/create-role", createRole);
roleRouter.delete("/delete-role/:id", createRole);
roleRouter.get("/roles", getAllRoles);
roleRouter.get("/users-roles", getAllUsersUnderAParticularRole);

export { roleRouter };
