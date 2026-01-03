import prisma from "../../config/db.js";
export const findUniqPerAbsen = async (userid, kelasid) => {
  return prisma.absensi.findFirst({
    where: {
      userid: userid,
      kelasid: kelasid,
    },
  });
};

export const isPresent = async (userid) => {
  return prisma.absensi.findFirst({
    where: {
      userid: userid,
      keluar: null,
    },
  });
};

export const createAbsensi = async (data) => {
  const newAbsensi = await prisma.absensi.create({
    data,
  });
  return newAbsensi;
};

export const absenPulangSiswa = async (args) => {
  const cek = await prisma.kelas.findFirst({
    where: {
      id: args.kelasid,
      keluar: null,
    },
  });
  if (cek) {
    throw new Error("Kelas belum Selesai.");
  }
  await prisma.absensi.update({
    where: {
      id: args.id,
    },
    data: {
      keluar: new Date(),
    },
  });
  return "Berhasil Keluar Kelas.";
};

export const getTotalAbsensiSiswa = async () => {
  const hasil = [];

  // Loop 6 hari ke belakang (termasuk hari ini)
  for (let i = 0; i < 7; i++) {
    const tanggal = new Date();
    tanggal.setDate(tanggal.getDate() - i);

    // format jadi rentang waktu harian
    const startDate = new Date(tanggal.setHours(0, 0, 0, 0));
    const endDate = new Date(tanggal.setHours(23, 59, 59, 999));

    const total = await prisma.absensi.count({
      where: {
        masuk: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const terlambat = await prisma.absensi.count({
      where: {
        status: false,
        masuk: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    hasil.push({
      tanggal: startDate.toISOString().slice(0, 10),
      total,
      hadirTepat: total - terlambat,
      terlambat,
    });
  }

  return hasil;
};

export const getTotalAbsensiGuru = async (guruid) => {
  // Count the number of active kelas for the guru
  // An active kelas is one where the keluar date is null
  return prisma.kelas.count({
    where: {
      guruid: guruid,
      keluar: null,
    },
  });
};

export const getTotalAbsensiAdmin = async () => {
  return prisma.absensi.count({
    where: {},
  });
};

export const statistikSeluruhAbsensi = async () => {
  return prisma.absensi.count({
    where: {
      guruid: guruid,
      keluar: null,
    },
  });
};

export const getStatistikAbsensiProfileSiswa = async (userid) => {
  const now = new Date();

  // Tanggal 1 bulan ini
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
    0,
    0,
    0,
    0
  );

  // Hari ini (akhir hari)
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

  const tepatWaktu = await prisma.absensi.count({
    where: {
      userid,
      status: true, // tepat waktu
      masuk: {
        gte: startOfMonth,
        lte: endOfToday,
      },
    },
  });

  const terlambat = await prisma.absensi.count({
    where: {
      userid,
      status: false, // terlambat
      masuk: {
        gte: startOfMonth,
        lte: endOfToday,
      },
    },
  });

  return {
    tepatWaktu,
    terlambat,
  };
};

export const getLaporanProfile = async (id, args) => {
  const periode = args.periode; // gunakan 1 variabel saja

  // Daftar periode dalam hari
  const periodeMap = {
    1: 7,
    2: 30,
    3: 90,
    4: 180,
    5: 360,
  };

  // === PERIODE 6 : HARI INI ===
  if (periode === "6") {
    const now = new Date();

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );

    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );
    const total = {
      terlambat: await prisma.absensi.count({
        where: {
          userid: id,
          status: false, // terlambat
          masuk: { gte: startOfDay, lte: endOfDay },
        },
      }),
      tepatWaktu: await prisma.absensi.count({
        where: {
          userid: id,
          status: true, // tepat waktu
          masuk: { gte: startOfDay, lte: endOfDay },
        },
      }),
    }
    const absensi = await prisma.absensi.findMany({
      orderBy: { masuk: "desc" },
      where: {
        userid: id,
        masuk: { gte: startOfDay, lte: endOfDay },
      }, select: {
        id: true,
        masuk: true,
        keluar: true,
        status: true,
        kelas: {
          select: {
            nama: true,
            guru: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    return {
      total,
      absensi,
    };
  }

  // === PERIODE 1–5 ===
  const hari = periodeMap[periode];

  if (!hari) return []; // kalau periode tidak valid

  const tanggalAwal = new Date();
  tanggalAwal.setDate(tanggalAwal.getDate() - hari);
  const total = {
    terlambat: await prisma.absensi.count({
      where: {
        userid: id,
        status: false, // terlambat
        masuk: {
          gte: tanggalAwal,
          lte: new Date(),
        },
      },
    }),
    tepatWaktu: await prisma.absensi.count({
      where: {
        userid: id,
        status: true, // tepat waktu
        masuk: {
          gte: tanggalAwal,
          lte: new Date(),
        },
      },
    }),
  }
  const absensi = await prisma.absensi.findMany({
    skip: args.skip,
    take: args.limit,
    orderBy: { masuk: "desc" },
    where: {
      userid: id,
      masuk: {
        gte: tanggalAwal,
        lte: new Date(),
      },
    }, select: {
      id: true,
      masuk: true,
      keluar: true,
      status: true,
      kelas: {
        select: {
          nama: true,
          guru: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
  return { total, absensi };
};

export const getDetailAbsensiKelas = async (id) => {
  return await prisma.absensi.findUnique({
    where: {
      id: id
    }, select: {
      id: true,
      masuk: true,
      keluar: true,
      status: true,
      userid: true,
      kelas: {
        select: {
          nama: true,
          masuk: true,
          keluar: true,
          expiredAt: true,
          guru: {
            select: {
              name: true,
              nohp: true,
              nip: true,
              photo: true
            }
          }
        }
      }
    }
  })
}
  