// types/laporan.ts
export interface DetailAbsensi {
  nis: string;
  namaSiswa: string;
  kelas: string;
  jumlahHadir: number;
  jumlahTerlambat: number;
  jumlahAlfa: number;
}

export interface LaporanSummary {
  rataRataKehadiran: string;
  totalKeterlambatan: number;
  jumlahAlfa: number;
  totalSiswa: number;
}

export interface LaporanData {
  summary: LaporanSummary;
  details: DetailAbsensi[];
}

export interface LaporanFormData {
  periode: string;
  tanggal: string;
  kelas: string;
  siswa: string;
}


export type PeriodeType = 'Harian' | 'Mingguan' | 'Bulanan';