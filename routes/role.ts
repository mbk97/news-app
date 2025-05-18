import { Router } from "express";
import { createRole, getAllRoles } from "../controller/roles";

const roleRouter = Router();

roleRouter.post("/create-role", createRole);
roleRouter.delete("/delete-role/:id", createRole);
roleRouter.delete("/roles", getAllRoles);

export { roleRouter };
