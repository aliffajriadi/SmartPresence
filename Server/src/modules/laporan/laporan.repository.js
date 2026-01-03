import prisma from "../../config/db.js";
import { formatDate } from "../../utils/helper/date.js";

export const getLaporanProfile = async (userId, args) => {
  const id = Number(userId);
  const { periode } = args;

  const periodeMap = {
    1: 7,
    2: 30,
    3: 90,
    4: 180,
    5: 360,
  };

  let startDate;
  let endDate = new Date();

  // 1. Tentukan Rentang Waktu
  if (periode === "6") {
    // Hari ini
    startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  } else if (periodeMap[periode]) {
    // N hari ke belakang
    startDate = new Date();
    startDate.setDate(startDate.getDate() - periodeMap[periode]);
  } else {
    return []; // Periode tidak valid
  }

  // 2. Satu Query untuk semua kondisi
  return prisma.absensi.findMany({
    where: {
      userid: id,
      masuk: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
      masuk: true,
      keluar: true,
      status: true,
      kelas: {
        select: {
          nama: true,
          guru: {
            select: {
              name: true,
              nip: true,
            },
          },
        },
      },
    },
    orderBy: {
      masuk: 'desc' // Tambahan: Urutkan dari yang terbaru
    }
  });
};

export const getLastActivity = async () => {
  const lastActivityCreateAccount = await prisma.user.findFirst({
    orderBy: {
      createdAt: "desc",
    }, select : {
      createdAt: true,
      name: true,
      role: true
    }
  });
  const lastActivityCreateClass = await prisma.kelas.findFirst({
    orderBy: {
      masuk: "desc",
    }, select : {
      masuk: true,
      nama: true,
      guru: {
        select: {
          name: true
        }
      }
    }
  })
  const lastActivityJoinClass = await prisma.absensi.findFirst({
    orderBy: {
      masuk: "desc",
    }, select : {
      masuk: true,
      user: {
        select: {
          name: true
        }
      },
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
  })
  const lastActivityChangePassword = {
    // LANJUT
    nama: "Bahlil Telah Merubah Password"
  }
  

  const data = {
    lastActivityCreateAccount: lastActivityCreateAccount,
    lastActivityCreateClass: lastActivityCreateClass,
    lastActivityJoinClass: lastActivityJoinClass,
    lastActivityChangePassword: lastActivityChangePassword
  }

  return data
}

export const getAdminLaporan = async (args) => {
  const { periode } = args;

  const periodeMap = {
    1: 7,
    2: 30,
    3: 90,
    4: 180,
    5: 360,
  };

  let startDate;
  let endDate = new Date();

  // Logika penentuan rentang waktu
  if (periode === "6") {
    // Hari ini (00:00:00.000 sampai 23:59:59.999)
    startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  } else if (periodeMap[periode]) {
    // N hari ke belakang
    startDate = new Date();
    startDate.setDate(startDate.getDate() - periodeMap[periode]);
  } else {
    // Jika periode tidak valid (termasuk undefined/null)
    return [];
  }

  // Cukup satu query untuk semua kondisi
const report = await prisma.$queryRaw`
  SELECT 
    u.id, 
    u.name, 
    u.nisn,
    CAST(COUNT(a.id) AS UNSIGNED) AS totalAbsensi,
    CAST(SUM(CASE WHEN a.status = 0 THEN 1 ELSE 0 END) AS UNSIGNED) AS totalStatusFalse
  FROM users u
  LEFT JOIN absensi a ON u.id = a.userid 
    AND a.masuk >= ${startDate} 
    AND a.masuk <= ${endDate}
  WHERE u.role = 'siswa'
  GROUP BY u.id, u.name, u.nisn
`;

// Konversi BigInt (angka dengan akhiran 'n') menjadi Number biasa
const formattedReport = report.map(item => ({
  ...item,
  totalAbsensi: Number(item.totalAbsensi),
  totalStatusFalse: Number(item.totalStatusFalse || 0)
}));
const dataPeriode = {
  startDate: formatDate(startDate),
  endDate: formatDate(endDate),
  totalHari: periodeMap[periode]
}
return {formattedReport, dataPeriode};
};

export const getKelasId = async (id) => {
  const kelasId = await prisma.kelas.findUnique({
    where: {
      id: id,
    },select: {
        id: true,
        masuk: true,
        keluar: true,
        nama: true,
        absensi: {
          select: {
            id: true,
            masuk: true,
            keluar: true,
            status: true,
            user: {
              select: {
                id: true,
                name: true,
                nisn: true,
              },
            },
          },
        },
      },
    }
  );
  return kelasId;
};

export const getStatistik = async () => {
  const dataStatistik = {
    totalKelas: await prisma.kelas.count(),
    totalAbsensi: await prisma.absensi.count(),
    totalSiswa: await prisma.user.count({where: {role: "siswa"}}),
    totalGuru: await prisma.user.count({where: {role: "guru"}}),
  }
  return dataStatistik;
};