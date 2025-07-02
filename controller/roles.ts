import { Request, Response } from "express";
import {
  createRoleService,
  deleteRoleService,
  getAllRolesService,
  getAllUserUnderRoleService,
} from "../services/roles";
import { customErrorHandler } from "../utils/apiError";

const createRole = async (req: Request, res: Response) => {
  const { roleName } = req.body;

  try {
    const { newRole } = await createRoleService(roleName);
    return res.status(201).json({
      message: "Role created successfully",
      role: newRole,
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const deleteRole = async (req: Request, res: Response) => {
  const { roleName } = req.body;
  const { usersUnderRoleToBeDeleted } = await deleteRoleService(roleName);
  res.status(200).json({
    message: "success",
    data: usersUnderRoleToBeDeleted,
  });
};

const getAllRoles = async (req: Request, res: Response) => {
  try {
    const { roles } = await getAllRolesService();
    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    const { message, statusCode, success } = customErrorHandler(error);
    res.status(statusCode).json({
      success: success,
      message,
    });
  }
};

const getAllUsersUnderAParticularRole = async (req: Request, res: Response) => {
  const { roleName } = req.params;

  const { usersUnderRole } = await getAllUserUnderRoleService(roleName);
  res.status(200).json({
    message: "success",
    data: usersUnderRole,
  });
};

export { createRole, deleteRole, getAllRoles, getAllUsersUnderAParticularRole };
