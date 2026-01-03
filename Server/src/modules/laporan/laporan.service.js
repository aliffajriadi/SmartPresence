import createPDF from "../../utils/helper/pdf.js";
import * as userRespository from "../user/user.repository.js";
import * as laporanRepository from "./laporan.repository.js";
import {
  formatTime,
  getDateString,
  formatDate,
} from "../../utils/helper/date.js";


export const getLaporanProfile = async (args) => {
  if (args.periode < 1 || args.periode > 6)
    throw new Error("periode must be 1-6");
  let id;
  let nama;
  let nisn;

  if (args.mode === "wa") {
    if (!args.nohp || !args.periode)
      throw new Error("nohp & periode is required");
    const user = await userRespository.findUniqueUserByFilter({
      nohp: args.nohp,
      role: "siswa"
    });
    if (!user) throw new Error("Nomor Kamu Belum terdaftar di Aplikasi SmartPresence, Silahkan Hubungi Admin!!");
    id = user.id;
    nama = user.name;
    nisn = user.nisn;
  } else if (args.mode === "web") {
    if (!args.id || !args.periode)
      throw new Error("id & periode is required");
    id = args.id;
    nama = args.nama;
    nisn = args.nisn;
  }

  const dataLaporan = await laporanRepository.getLaporanProfile(id, args);
  if (dataLaporan.length === 0) throw new Error("Belum ada absensi");
  const laporanTabel = dataLaporan.map((item) => {
    return {
      Tanggal: formatDate(item.masuk),
      Ruangan: item.kelas.nama,
      Guru: `${item.kelas.guru.name} - ${item.kelas.guru.nip}`,
      masuk: formatTime(item.masuk),
      keluar: item.keluar
        ? formatTime(item.keluar)
        : "Belum Keluar",
      status: item.status ? "Tepat Waktu" : "Terlambat",
    };
  });
  const nameFile = `rekap_absen_${nama}.pdf`;
  const filePath = `./storage/pdf/${nameFile}`; // folder penyimpanan
  const labelPeriode = {
    1: `7 Hari Terakhir ${formatDate(new Date())} - ${formatDate(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    )}`,

    2: `Sebulan Terakhir ${formatDate(new Date())} - ${formatDate(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    )}`,

    3: `3 Bulan Terakhir ${formatDate(new Date())} - ${formatDate(
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    )}`,

    4: `Semester Terakhir ${formatDate(new Date())} - ${formatDate(
      new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    )}`,

    5: `Tahun Terakhir ${formatDate(new Date())} - ${formatDate(
      new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    )}`,

    6: `Hari ini ${formatDate(new Date())}`,
  };

  //LANJUTIN BUAT YG PDF NYA
  await createPDF({
    filename: filePath,
    logoPath: "./assets/logo1.png",
    title: `Rekap Absensi`,
    subtitle: `Nama           : ${nama}
NISN            : ${nisn}
Periode        : ${labelPeriode[args.periode]}
Dibuat pada : ${formatDate(new Date())}`,
    table: laporanTabel,
  }).then(() => console.log("PDF Rekap dibuat!"));
  return filePath;
};

export const getLastActivity = async () => {
  const lastActivity = await laporanRepository.getLastActivity();
  return lastActivity;
};

export const getAdminLaporan = async (args) => {
  const adminLaporan = await laporanRepository.getAdminLaporan(args);
  if (adminLaporan.length === 0) throw new Error("Belum ada absensi");

  const laporanTabel = adminLaporan.formattedReport.map((item) => {
    return {
      Nama: item.name,
      Nisn: item.nisn,
      Tepat: item.totalAbsensi - item.totalStatusFalse,
      Terlambat: item.totalStatusFalse,
      Total: item.totalAbsensi,
    };
  });

  const filePath = `./storage/pdf/rekap_absen_admin.pdf`;
  await createPDF({
    filename: filePath,
    logoPath: "./assets/logo1.png",
    title: `Rekap Absensi`,
    subtitle: `Dibuat pada : ${getDateString()}
Periode: ${adminLaporan.dataPeriode.startDate} - ${adminLaporan.dataPeriode.endDate}
Total Hari: ${adminLaporan.dataPeriode.totalHari} Hari Kebelakang`,
    table: laporanTabel,
  }).then(() => console.log("PDF Rekap dibuat!"));
  return filePath;
};

export const getKelasId = async (args) => {
  const id = parseInt(args);
  if (isNaN(id)) throw new Error("id must be a number");
  const kelasId = await laporanRepository.getKelasId(id);
  const laporanTabel = kelasId.absensi.map((item) => {
    return {
      Nama: item.user.name,
      Nisn: item.user.nisn,
      Masuk: formatTime(item.masuk),
      Keluar: item.keluar ? formatTime(item.keluar) : "Belum Keluar",
      Status: item.status ? "Tepat Waktu" : "Terlambat",
    };
  });
  const filePath = `./storage/pdf/rekap_absen_kelas_id_${id}.pdf`;
  await createPDF({
    filename: filePath,
    logoPath: "./assets/logo1.png",
    title: `Rekap Absensi`,
    subtitle: `Ruangan: ${kelasId.nama}
Dibuat pada : ${getDateString()}
Tanggal Kelas: ${formatDate(kelasId.masuk)}`,
    table: laporanTabel,
  }).then(() => console.log("PDF Rekap dibuat!"));
  return filePath;
};

export const getStatistik = async () => {
  const dataStatistik = await laporanRepository.getStatistik();
  return dataStatistik;
};
