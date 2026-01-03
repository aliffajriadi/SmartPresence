export interface User {
  id: number;
  name: string;
  role: "admin" | "guru" | "siswa";
  nohp?: string;
  nip?: string;   // hanya guru
  nis?: string;   // hanya siswa
  password?: string;
}


export interface datauser {
    id: number;
    name: string;
}

export interface CreateUserPayload {
  name: string;
  role: "admin" | "guru" | "siswa";
  nohp?: string;
  nip?: string;      // hanya guru
  nisn?: string;     // hanya siswa
  password: string;
  notif_aktif?: boolean;
  photo?: string;
  rfidCode?: string; // wajib untuk guru/siswa
  rfid?: string;  
}

export interface SiswaProfilInfoProps {
  name: string;
  nisn: string;
  photo?: string;
  nohp?: string;
  rfid: string;
  notifikasi?: boolean;
}


export interface ProfilInfoProps {
  name: string;
  nip: string;
  photo?: string;
  nohp?: string;
  uidRfid: string;
  notifikasi?: boolean;
}

export interface UserUpdatePassword {
  password: string;
  confirm_password: string;
}