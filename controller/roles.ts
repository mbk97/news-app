import { Request, Response } from "express";
import {
  createRoleService,
  deleteRoleService,
  getAllRolesService,
  getAllUserUnderRoleService,
} from "../services/roles";

const createRole = async (req: Request, res: Response) => {
  const { roleName } = req.body;

  try {
    const { newRole } = await createRoleService(roleName);
    return res.status(201).json({
      message: "Role created successfully",
      role: newRole,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
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
    res.status(500).json({
      success: false,
      message:
        error.message || "Failed to fetch categories. Please try again later.",
    });
  }
};

const getAllUsersUnderAParticularRole = async (req: Request, res: Response) => {
  const { roleName } = req.params;

  console.log(roleName);

  const { usersUnderRole } = await getAllUserUnderRoleService(roleName);
  res.status(200).json({
    message: "success",
    data: usersUnderRole,
  });
};

export { createRole, deleteRole, getAllRoles, getAllUsersUnderAParticularRole };
