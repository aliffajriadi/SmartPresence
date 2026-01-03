import * as bcrypt from "../../utils/helper/bcrypt.js";
import { generateToken } from "../../utils/helper/jwt.js";
import { findUniqueUserByFilter } from "../user/user.repository.js";
import { logActivity } from "../../utils/helper/log.js";

export const login = async (loginData, req) => {
  // Sanitasi input
  Object.keys(loginData).forEach((k) => {
    if (typeof loginData[k] === "string") loginData[k] = loginData[k].trim();
  });

  const roleConfigs = {
    guru: { field: "nip", label: "NIP" },
    admin: { field: "name", label: "Name" },
    siswa: { field: "nisn", label: "NISN" },
  };

  const config = roleConfigs[loginData.role];
  if (!config) throw new Error("Invalid role");

  if (!loginData[config.field]) {
    throw new Error(`${config.label} is required for role ${loginData.role}`);
  }

  const user = await findUniqueUserByFilter({
    [config.field]: loginData[config.field],
  });
  if (!user || user.role !== loginData.role)
    throw new Error("Invalid credentials");

  const isValid = await bcrypt.comparePassword(
    loginData.password,
    user.password
  );
  if (!isValid) throw new Error("Invalid credentials");

  const payloadInRole = {
    fieldLabel: {
      guru: "nip",
      siswa: "nisn",
      admin: "admin",
    },
    fieldGet: {
      guru: user.nip,
      siswa: user.nisn,
      admin: "True",
    },
  };

  const payload = {
    id: user.id,
    role: user.role,
    name: user.name,
    photo: user.photo,
    [payloadInRole.fieldLabel[user.role]]: payloadInRole.fieldGet[user.role],
  };
  await logActivity(req, "login", user.id);

  const token = generateToken(payload, process.env.JWT_EXPIRE || "1h");

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};
