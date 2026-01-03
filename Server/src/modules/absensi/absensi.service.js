import * as absensiRepository from "./absensi.repository.js";
import { sendWhatsappMessage } from "../../utils/external/api.whatsapp.js";
import { dateString } from "../../utils/helper/date.js";

export const handleAbsensiSiswa = async (kelasRepository, user, ruangan) => {
  try {
    const isPresent = await absensiRepository.isPresent(user.id);
    if (!isPresent) {
      const kelas = await kelasRepository.kelasActive(ruangan);
      if (!kelas) throw new Error("Kelas belum ada.");
      let statusMasuk;
      if (!kelas.status) {
        statusMasuk = false;
      } else {
        statusMasuk = true;
      }
      await absensiRepository.createAbsensi({
        userid: user.id,
        kelasid: kelas.id,
        status: statusMasuk,
      });
      if (user.notif_aktif) {
        sendWhatsappMessage(
          user.nohp,
          `📢 *Notifikasi Kehadiran Siswa*

Halo Orang Tua/Wali dari *${user.name}* 👋,

Kami informasikan bahwa *${user.name}* telah hadir di kelas, ruangan: *${
            kelas.nama
          }* ✅

👨‍🏫 Guru Pengajar:
• Nama : *${kelas.guru.name}*
• NIP  : *${kelas.guru.nip}*
• Kontak no hp  : *${kelas.guru.nohp}*
• Status  : *${statusMasuk ? "Masuk Tepat Waktu" : "Terlambat"}*


🕒 Waktu Kehadiran:
*${dateString}*

Terima kasih atas perhatian Bapak/Ibu 🙏`
        );
      }

      const message = `${user.name} Berhasil Absen`;
      return message;
    }
    const absenPulang = await absensiRepository.absenPulangSiswa({
      id: isPresent.id,
      kelasid: isPresent.kelasid,
    });
    if (user.notif_aktif) {
      sendWhatsappMessage(
        user.nohp,
        `📢 *Notifikasi Kepulangan Siswa*

Halo Orang Tua/Wali dari *${user.name}* 👋,

Kami informasikan bahwa *${user.name}* telah *selesai mengikuti kegiatan pembelajaran* dan telah *keluar dari kelas* pada waktu berikut:

🕒 Waktu Keluar: *${dateString}*

Terima kasih atas perhatian dan kerja sama Bapak/Ibu dalam memantau kehadiran siswa 🙏`
      );
    }

    return absenPulang;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const handleAbsensiGuru = async (kelasRepository, user, ruangan) => {
  const cekKelas = await kelasRepository.cekKelas(user.id, ruangan);
  // if (cekKelas) throw new Error(`Anda sudah memiliki kelas di ruangan ${cekKelas.nama}`);
  if (cekKelas) {
    if (cekKelas.status) {
      await kelasRepository.editStatusKelas(cekKelas.id);
      if (user.notif_aktif) {
        sendWhatsappMessage(
          user.nohp,
          `📢 *Notifikasi Keluar Kelas*
          
Nama : *${user.name}* 👋,
jam masuk : ${cekKelas.masuk}
jam keluar : ${dateString}
ruangan : ${cekKelas.nama}

Terima kasih atas perhatian Bapak/Ibu 🙏`
        );
      }
      const message = `${user.name} Berhasil Keluar Kelas`;
      return message;
    }
  }
  const kelasCreatedAt = dateString;
  await kelasRepository.createKelas(user.id, ruangan);
  if (user.notif_aktif) {
    sendWhatsappMessage(
      user.nohp,
      `🎉 *Kelas Berhasil Dibuat*

Halo *${user.name}* 👋,

Anda telah berhasil membuat kelas di ruangan *${ruangan}* pada:
🗓️ *${kelasCreatedAt}*

Rekapan kelas anda dapat dilihat pada website.
Selamat mengajar, semoga pembelajaran berjalan lancar 🙏`
    );
  }

  const message = `Kelas berhasil dibuat oleh ${user.name}`;
  return message;
};
export const getTotalAbsensi = async () => {
  const dataAbsensiSiswa = await absensiRepository.getTotalAbsensiSiswa();
  return dataAbsensiSiswa;
};
export const getTotalAbsensiSiswa = async (user) => {
  const absensi = await absensiRepository.getTotalAbsensiSiswa(user.id);
  return absensi;
};

export const getStatistikAbsensiProfileSiswa = async (userId) => {
  const absensi = await absensiRepository.getStatistikAbsensiProfileSiswa(
    userId
  );
  return absensi;
};

export const getSiswaAbsensiTable = async (args) => {
  args.page = parseInt(args.page) || 1;
  args.limit = parseInt(args.limit) || 10;
  args.skip = (args.page - 1) * args.limit;

  const absensi = await absensiRepository.getLaporanProfile(args.id, args);
  const totalAbsensi = absensi.total.tepatWaktu + absensi.total.terlambat;
  return {
    page: args.page,
    limit: args.limit,
    totalPages: Math.ceil(totalAbsensi / args.limit),
    total: absensi.total,
    absensi: absensi.absensi,
  };
};

export const getDetailAbsensiKelas = async (id, currentUser) => {
  const absensi = await absensiRepository.getDetailAbsensiKelas(id);
  if (!absensi) {
    throw new Error("Absensi tidak ditemukan.");
  }
  if (absensi.userid !== currentUser) {
    throw new Error("Anda tidak memiliki akses ke absensi ini.");
  }
  return absensi;
};
