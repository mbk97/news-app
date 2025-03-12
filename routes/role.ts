import { Router } from "express";
import { createRole } from "../controller/roles";

const roleRouter = Router();

roleRouter.post("/create-role", createRole);
roleRouter.delete("/delete-role/:id", createRole);

export { roleRouter };
