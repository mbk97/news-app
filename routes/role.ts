import { Router } from "express";
import { createRole } from "../controller/roles";

const roleRouter = Router();

roleRouter.post("/create-role", createRole);

export { roleRouter };
