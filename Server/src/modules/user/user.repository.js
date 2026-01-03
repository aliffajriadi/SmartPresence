import prisma from "../../config/db.js";

export const getAllUsersPaginated = async (skip, limit, where = {}) => {
  const users = await prisma.user.findMany({
    skip: skip,
    take: limit,
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      nisn: true,
      nip: true,
      role: true,
      nohp: true,
      photo: true,
      createdAt: true,
      rfid: {
        select: {
          rfid: true,
        },
      },
    },
  });
  return users;
};
export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
    include: { rfid: true },
  });
  return user;
};
export const createUser = async (userData) => {
  const newUser = await prisma.user.create({
    data: {
      name: userData.name,
      nisn: userData.nisn,
      nip: userData.nip,
      role: userData.role,
      password: userData.password,
      nohp: userData.nohp,

      // ✅ bikin rfid langsung
      rfid: userData.rfidCode
        ? {
            create: {
              rfid: userData.rfidCode,
            },
          }
        : undefined, // kalau tidak ada rfid, dilewatkan
    },
    include: {
      rfid: true, // biar data RFID ikut balik
    },
  });

  return newUser;
};
export const updateUser = async (id, userData) => {
  const { rfidCode, ...userFields } = userData;
  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: {
      ...userFields,

      rfid: rfidCode
        ? {
            upsert: {
              create: { rfid: rfidCode },
              update: { rfid: rfidCode },
            },
          }
        : undefined,
    },
    include: {
      rfid: true,
    },
  });
  return updatedUser;
};
export const deleteUser = async (id) => {
  const deletedUser = await prisma.user.delete({
    where: { id: id },
  });
  return deletedUser;
};
export const findManyUserByFilter = async (filter, page, limit, skip) => {
  const [total, users] = await Promise.all([
    getCountUsers(filter),
    prisma.user.findMany({
      where: filter,
      select: {
        id: true,
        name: true,
        nisn: true,
        nip: true,
        role: true,
        photo: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    users,
  };
};
export const findUniqueUserByFilter = async (filter) => {
  return prisma.user.findFirst({
    where: filter,
  });
};
export const getCountUsers = async (filter) => {
  if (!filter) {
    return prisma.user.count();
  }
  return prisma.user.count({
    where: filter,
  });
};
export const searchUser = async (query) => {
  const q = query.query;

  const whereFilter = {
    role: query.role,
    OR: [
      { name: { contains: q } },
      { nisn: { contains: q } },
      { nip: { contains: q } },
      { nohp: { contains: q } },
      {
        rfid: {
          is: {
            rfid: { contains: q },
          },
        },
      },
    ],
  };

  // Ambil data dengan pagination
  const users = await prisma.user.findMany({
    where: whereFilter,
    select: {
      id: true,
      name: true,
      nisn: true,
      nip: true,
      role: true,
      nohp: true,
      photo: true,
      createdAt: true,
      rfid: {
        select: { rfid: true },
      },
    },
    skip: query.skip,
    take: query.limit,
    orderBy: { createdAt: "desc" },
  });

  // Ambil total user yang sesuai filter (tanpa skip & take)
  const total = await prisma.user.count({
    where: whereFilter,
  });

  return {
    total,
    users,
  };
};
export const createLogsActivity = async (data) => {

  return await prisma.log_aktifitas.create({
    data: {
      userid: data.userid,
      aktivitas: data.action,
      ip: data.ip,
      browser: data.browser,
      os: data.os,
      platform: data.platform,
      isMobile: data.isMobile,
      createdAt: data.timestamp,
    },
  });
};
export const getLogActivityProfile = async (args) => {
  const data = await prisma.log_aktifitas.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      userid: args.id,
    },
    skip: args.skip,
    take: args.limit,
  });
  const total = await prisma.log_aktifitas.count({
    where: {
      userid: args.id,
    },
  });

  return {
    total,
    data,
  };
};

export const getLogActivityProfileDetail = async (id) => {
  const data = await prisma.log_aktifitas.findUnique({
    where: { id: id },
  });
  return data;
};