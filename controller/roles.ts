import { Request, Response } from "express";
import Roles from "../model/roles";
import Users from "../model/userModel";

const createRole = async (req: Request, res: Response) => {
  const { roleName } = req.body;

  try {
    if (!roleName) {
      return res.status(400).json({
        message: "Role Name is required",
      });
    }

    const existingRole = await Roles.findOne({ roleName });

    if (existingRole) {
      return res.status(409).json({ message: "Role already exists" });
    }

    const newRole = await Roles.create({
      roleName,
    });

    return res.status(201).json({
      message: "Role created successfully",
      role: newRole,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteRole = async (req: Request, res: Response) => {
  const { roleName } = req.body;

  if (!roleName) {
    res.status(400).json({
      message: "Role not found!",
    });
  }
  const usersUnderRoleToBeDeleted = await Users.findById(roleName);

  res.status(200).json({
    message: "success",
    data: usersUnderRoleToBeDeleted,
  });
};
const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Roles.find();
    console.log(roles);

    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories. Please try again later.",
    });
  }
};

export { createRole, deleteRole, getAllRoles };
