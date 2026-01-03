import * as userRepository from "./user.repository.js";
import * as bcrypt from "../../utils/helper/bcrypt.js";
import { findRfid } from "../rfid/rfid.repository.js";
import { logActivity } from "../../utils/helper/log.js";

export const getAllUsersPaginated = async (filter) => {
  const page = parseInt(filter.page) || 1;
  const limit = parseInt(filter.limit) || 10;
  const role = filter.role || null;
  const where = role ? { role } : {};
  const skip = (page - 1) * limit;
  const users = await userRepository.getAllUsersPaginated(skip, limit, where);
  const total = await userRepository.getCountUsers(where);
  const data = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    users,
  };
  if (!users.length) {
    throw new Error("Users not found");
  }
  return data;
};
export const getUserById = async (id) => {
  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
export const createUser = async (userData) => {
  const { role, nip, nisn, rfidCode, name, password, nohp } = userData;

  // --- Validasi umum ---
  if (!name || !role || !password || !nohp) {
    throw new Error("Name, role, password, and phone number are required");
  }

  // --- Validasi peran (guru/siswa) ---
  const roleValidators = {
    guru: {
      required: { nip, rfidCode },
      uniqueField: "nip",
      uniqueError: "NIP already exists",
      missingError: "NIP / RFID is required for role guru",
    },
    siswa: {
      required: { nisn, rfidCode },
      uniqueField: "nisn",
      uniqueError: "NISN already exists",
      missingError: "NISN / RFID is required for role siswa",
    },
  };

  const validator = roleValidators[role];

  if (validator) {
    // Cek field wajib
    const missing = Object.entries(validator.required).some(([_, v]) => !v);
    if (missing) throw new Error(validator.missingError);

    // Cek keunikan nip/nisn
    const cekUniq = await userRepository.findUniqueUserByFilter({
      [validator.uniqueField]: userData[validator.uniqueField],
    });
    if (cekUniq) throw new Error(validator.uniqueError);

    // Cek keunikan RFID
    const cekRfid = await findRfid(rfidCode);
    if (cekRfid) throw new Error("RFID already exists");
  }

  // --- Normalisasi nomor HP ---
  if (nohp.startsWith("08")) {
    userData.nohp = nohp.replace(/^08/, "628");
  }

  // --- Hash password dan buat user ---
  userData.password = await bcrypt.hashPassword(password);
  const newUser = await userRepository.createUser(userData);
  if (!newUser) {
    throw new Error("Failed to create user");
  }
  return newUser;
};
export const updateUser = async (id, userData, req) => {
  if (!id) throw new Error("ID is required");
  id = Number(id);
  if (userData.nohp && userData.nohp.startsWith("08")) {
    userData.nohp = userData.nohp.replace(/^08/, "628");
  }
  const updatedUser = await userRepository.updateUser(id, userData);

  if (!updatedUser) {
    throw new Error("User not found");
  }
  if (userData.notif_aktif === true) {
    await logActivity( req, "update_notifikasi_aktif", id);
  } else if (userData.notif_aktif === false) {
    await logActivity( req,"update_notifikasi_nonaktif", id);
  }
  return updatedUser;
};
export const deleteUser = async (id) => {
  await getUserById(id);
  const deletedUser = await userRepository.deleteUser(id);
  if (!deletedUser) {
    throw new Error("User not found");
  }
  return deletedUser;
};
export const getUniqUsersByExactFilter = async (filter) => {
  const { id, name, nohp, nis, nip } = filter;

  const whereClause = {};
  if (id) whereClause.id = Number(id);
  if (name) whereClause.name = name; // exact match
  if (nohp) whereClause.nohp = nohp; // exact match
  if (nis) whereClause.nis = nis;
  if (nip) whereClause.nip = nip;

  const users = await userRepository.findUniqueUserByFilter(whereClause);

  return users;
};
export const getManyUsersByExactFilter = async (filter) => {
  const { role } = filter;
  const page = parseInt(filter.page) || 1;
  const limit = parseInt(filter.limit) || 10;
  const skip = (page - 1) * limit;

  const whereClause = {};
  if (role) whereClause.role = role;

  const users = await userRepository.findManyUserByFilter(
    whereClause,
    page,
    limit,
    skip
  );

  return users;
};
export const searchUsers = async (query) => {
  if (!query.query || !query.role) {
    throw new Error("Query & Role is required");
  }
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  const data = {
    query: query.query,
    role: query.role,
    page,
    limit,
    skip,
  };

  let users = await userRepository.searchUser(data);
  users = {
    page,
    limit,
    total: users.total,
    totalPages: Math.ceil(users.total / limit),
    users: users.users,
  };
  return users;
};

export const updatePasswordProfile = async (id, body) => {
  if (!id) throw new Error("ID is required");
  id = Number(id);
  const getUser = await getUserById(id);
  const validatePassword = await bcrypt.comparePassword(
    body.confirm_password,
    getUser.password
  );
  if (!validatePassword) {
    throw new Error("Password tidak sesuai dengan password sebelumnya !!");
  }

  // daftar password yang dilarang
  const forbiddenPasswords = [
    "123456",
    "password",
    "siswa123",
    "guru123",
    "qwerty",
    (getUser.name || "").toLowerCase(),
    (getUser.nip || "").toLowerCase(),
    (getUser.nisn || "").toLowerCase(),
    (getUser.nohp || "").toLowerCase(),
    ((getUser.name || "") + "123").toLowerCase(),
    "sayang123",
    "admin123",
  ];

  if (forbiddenPasswords.includes(body.password)) {
    throw new Error("Password terlalu mudah !!");
  }

  const hashedPassword = await bcrypt.hashPassword(body.password);
  const payload = {
    password: hashedPassword,
  };
  const updatedUser = await updateUser(id, payload);
  if (!updatedUser) {
    throw new Error("User tidak ditemukan !!");
  }
  return updatedUser;
};

export const getLogActivityProfile = async (args) => {
  if (!args.id) throw new Error("ID is required");
  if( !args.page || !args.limit) throw new Error("Page & Limit is required");

  args.page = parseInt(args.page) || 1;
  args.limit = parseInt(args.limit) || 10;
  args.skip = (args.page - 1) * args.limit;
  const data = await userRepository.getLogActivityProfile(args);
  return {
    page: args.page,
    limit: args.limit,
    totalPages: Math.ceil(data.total / args.limit),
    total: data.total,
    data: data.data
  };
};
export const getLogActivityProfileDetail = async (id, idLog) => {
  if (!id || !idLog) throw new Error("id in params is required");
  const data = await userRepository.getLogActivityProfileDetail(idLog);
  if (id !== data.userid) throw new Error("You are not allowed to access this data");
  return data;
};