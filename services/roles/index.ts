import Roles from "../../model/roles";
import Users from "../../model/userModel";

const createRoleService = async (roleName: string) => {
  const existingRole = await Roles.findOne({ roleName });

  if (existingRole) throw new Error("Role already exists");

  const newRole = await Roles.create({
    roleName,
  });

  return { newRole };
};

const deleteRoleService = async (roleName: string) => {
  const usersUnderRoleToBeDeleted = await Users.findById(roleName);

  return { usersUnderRoleToBeDeleted };
};

const getAllRolesService = async () => {
  const roles = await Roles.find();
  return { roles };
};
const getAllUserUnderRoleService = async (roleName: string) => {
  const usersUnderRole = await Users.find({ roleName });
  return { usersUnderRole };
};

export {
  createRoleService,
  deleteRoleService,
  getAllRolesService,
  getAllUserUnderRoleService,
};
