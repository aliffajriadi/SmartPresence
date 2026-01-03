// types/siswa.ts
export interface Siswa {
  id: string;
  nisn: string;
  name: string;
  rfid: { rfid: string };
  nohp: string;
  photo?: string;
}

export interface SiswaFormData {
  nisn: string;
  name: string;
  rfid?: string;
  nohp: string;
}

export interface FormErrors {
  nisn?: string;
  nama_lengkap?: string;
  kelas?: string;
  rfidCode?: string;
  nama_orang_tua?: string;
  nohp?: string;
}