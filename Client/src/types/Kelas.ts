export interface Class {
  id: number;
  namaKelas: string;
  waliKelas: string;
  jumlahSiswa: number;
}

export interface Teacher {
  id: number;
  name: string;
}

export interface ClassFormData {
  namaKelas: string;
  waliKelas: string;
  keterangan: string;
}