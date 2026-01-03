import prisma from "../../config/db.js";

const deleteManyExpiredOTP = async () => {
  return prisma.password_otp.deleteMany({
    where: {
      expiredAt: {
        lt: new Date(), // Hapus jika waktu expired sudah berlalu dari waktu sekarang
      },
    },
  });
};

export const getUserById = async (role, nohp, noinduk) => {
  deleteManyExpiredOTP();
  const whereClause = {
    nohp: nohp,
    ...(role === "guru" ? { nip: noinduk } : { nisn: noinduk }),
  };

  return prisma.user.findFirst({
    where: whereClause,
    select: {
      id: true,
      nohp: true,
    },
  });
};

export const getOTPpassword = async (id) => {
  deleteManyExpiredOTP();
  return prisma.password_otp.findFirst({
    where: {
      userid: id,
    },
  });
};

export const updateOTP = async (id, otp) => {
  deleteManyExpiredOTP();
  return prisma.password_otp.create({
    data: {
      userid: id,
      otp: otp,
      expiredAt: new Date(Date.now() + 3 * 60 * 1000),
    },
  });
};

export const deleteOTP = async (id) => {
  deleteManyExpiredOTP();
  return prisma.password_otp.deleteMany({
    where: {
      userid: id,
    },
  });
};
