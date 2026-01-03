import prisma from "../../config/db.js";

export const getUserByRfid = async (rfid) => {
  const user = await prisma.user.findFirst({
    where: {
      rfid: {
        rfid: rfid,
      },
    },
    include: {
      rfid: true,
    },
  });
  return user;
};
export const findRfid = async (rfid) => {
  return prisma.rfid.findUnique({
    where: {
      rfid: rfid,
    },
  });
};
