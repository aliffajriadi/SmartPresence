import { getUserByRfid } from "../rfid/rfid.repository.js";
import * as kelasRepository from "./kelas.repository.js";
import * as absensiService from "../absensi/absensi.service.js";

export const tapRFID = async (rfid, ruangan) => {
  const user = await getUserByRfid(rfid);
  if (!user) {
    throw new Error("User not found");
  }

  switch (user.role) {
    case "guru":
      return await absensiService.handleAbsensiGuru(kelasRepository, user, ruangan);

    case "siswa":
      return await absensiService.handleAbsensiSiswa(kelasRepository, user, ruangan);

    default:
      throw new Error(`Unsupported role: ${user.role}`);
  }
};

export const getKelasAjar = async (guruId) => {
  return await kelasRepository.getKelasAjar(guruId);
};

export const getKelasSiswa = async (filter) => {
  if (!filter.id) {
    throw new Error("Id Kelas Wajib diisi");
  }
  filter.id = parseInt(filter.id);
  filter.page = parseInt(filter.page);
  filter.limit = parseInt(filter.limit);
  const skip = (filter.page - 1) * filter.limit;
  filter.skip = skip;

  const data = await kelasRepository.getKelasSiswa(filter);

  return {
    page: filter.page,
    limit: filter.limit,
    total: data.total,
    totalPages: Math.ceil(data.total / filter.limit),
    users: data.data,
  };
};

export const getRealtimeSesi = async (guruId) => {
  const data = await kelasRepository.getRealtimeSesi(guruId);
  if (!data) {
    throw new Error("Kelas tidak ditemukan");
  }
  return data;
};

export const getAllKelas = async () => {
  const data = await kelasRepository.getAllKelas();
  return data;
};