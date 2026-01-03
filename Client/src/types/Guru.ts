export interface Teacher {
  id: string;
  nip?: string;
  nama: string;
  name?: string;
  photo?: string;
  nohp: string;
  rfid?: {
    rfid: string;
  };
  role: "guru" | "siswa" | "admin";
}

export interface TeacherFormData {
  id: string;
  role: "guru" | "siswa" | "admin";
  nip: string;
  nama: string;
  nohp: string;
  rfidCode?: string;
}

export interface FormErrors {
  id?: string;
  nama?: string;
  email?: string;
  nohp?: string;
  rfidCode?: string;
}

export interface Guru {
  name: string;
  nip?: string;
  nohp?: string;
  photo?: string;
}

export interface Kelas {
  nama: string;
  masuk: string;
  keluar: string;
  expiredAt: string;
  guru: Guru;
}

export interface Absensi {
  id: number;
  status: boolean;
  masuk: string;
  keluar: string;
  kelas: Kelas;
}

export interface Student {
  id: number;
  name: string;
  nisn?: string;
  photo?: string;
  status: "hadir" | "belum" | "terlambat";
  absenMasuk?: string;
  rfid?: {
    rfid: string;
  };
}

export interface Session {
  id: number;
  kelasNama: string;
  masuk: string;
  keluar: string;
  expiredAt: string;
  totalSiswa: number;
  siswaHadir: number;
  students: Student[];
}
