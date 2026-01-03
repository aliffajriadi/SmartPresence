import { api } from '@/lib/axios';

export const getDetailClassAbsensi = async (id: number) => {
  const res = await api.get(`/absensi/detail-absensi/kelas/${id}`, { withCredentials: true });
  return res.data.data;
}
export const getKelasAjar = async () => {
  const res = await api.get(`/kelas/kelas-ajar`, { withCredentials: true });
  return res.data.data;
}
export const getSiswaByKelasId = async (id: number, page: number, limit: number) => {
  const res = await api.get(`/kelas/kelas-siswa?page=${page}&limit=${limit}&id=${id}`, { withCredentials: true });
  return res.data.data;
}

export const getActiveSession = async () => {
  const res = await api.get(`/kelas/realtime-sesi`, { withCredentials: true });
  return res.data;
}

export const getLaporan = async (periode: number, kelas: string, tanggal: string) => {
  const res = await api.get(`/laporan/absensi?periode=${periode}&kelas=${kelas}&tanggal=${tanggal}`, { withCredentials: true });
  return res;
}

export const getAllKelas = async () => {
  const res = await api.get(`/kelas/all`, { withCredentials: true });
  return res.data.data;
}