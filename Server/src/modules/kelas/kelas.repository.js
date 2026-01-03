import prisma from "../../config/db.js";

export const createKelas = async (guruid, ruangan) => {
    const expiredAt = new Date(Date.now() + 10 * 60 * 1000);
    // const expiredAt = new Date(Date.now()); 

    const newKelas = await prisma.kelas.create({
        data: {
            guruid: guruid,
            expiredAt: expiredAt,
            nama: ruangan
        },
    });
    return newKelas;
};
export const editStatusKelas = async (id) => {
    const updatedKelas = await prisma.kelas.update({
        where: {
            id: id,
        },
        data: {
            status: false,
            keluar: new Date(),
        },
    });
    return updatedKelas;
};
export const kelasActive = async (ruangan) => {
  await prisma.kelas.updateMany({
    where: {
      status: true,
      expiredAt: { lte: new Date() },
    },
    data: { status: false },
  });

  return prisma.kelas.findFirst({
    where: {
      keluar: null,
      nama: ruangan
    },
    include: {
        guru: true
    },
    orderBy: { masuk: "desc" }, 
  });
};
export const cekKelas = async (id, ruangan) => {
  return prisma.kelas.findFirst({
    where: {
      status: true,
      expiredAt: { gt: new Date() },
      guruid: id,
      nama: ruangan
    },
    orderBy: { masuk: "desc" }, 
  });
};

export const getKelasAjar = async (guruId) => {
  return await prisma.kelas.findMany({
    where: {
      guruid: guruId,
      keluar: {
        not: null,
      },
    }, select: {
        id: true,
        nama: true,
        masuk: true,
        keluar: true,
      },
    orderBy: { masuk: "desc" }, 
  });
};

export const getKelasSiswa = async (filter) => {
  const data = await prisma.absensi.findMany({
    where: {
      kelasid: filter.id,
    },select: {
        id: true,
        masuk: true,
        keluar: true,
        status: true,
        user: {
          select: {
            id: true,
            name: true,
            nisn: true,
            nohp: true,
            photo: true,
            rfid: {
              select: { rfid: true },
            },
          },
        },
      },
    orderBy: { masuk: "desc" },
    skip: filter.skip,
    take: filter.limit, 
  });
  const total = await prisma.absensi.count({
    where: {
      kelasid: filter.id,
    },
  });
  return {
    total,
    data,
  };
};

export const getRealtimeSesi = async (guruId) => {
  return await prisma.kelas.findFirst({
    where: {
      guruid: guruId,
      keluar: null,
    }, select: {
        id: true,
        nama: true,
        masuk: true,
        expiredAt: true,
        absensi: {
          select: {
            id: true,
            masuk: true,
            status: true,
            user: {
              select: {
                id: true,
                name: true,
                nisn: true,
                photo: true,
                rfid: {
                  select: { rfid: true },
                },
              },
            },
          },
        },
      },
    orderBy: { masuk: "desc" }, 
  });
};

export const getAllKelas = async () => {
  const data = await prisma.kelas.findMany({
    select: {
        id: true,
        nama: true,
        masuk: true,
        keluar: true,
        guru: {
          select: {
            id: true,
            name: true,
            nip: true,
            nohp: true,
            photo: true,
            rfid: {
              select: { rfid: true },
            },
          },
        },
      },
    orderBy: { masuk: "desc" }, 
  });
  return data;
};
