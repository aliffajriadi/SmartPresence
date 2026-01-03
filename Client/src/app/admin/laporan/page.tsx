"use client";

import AdminLayout from "../component/layout/Layout";
import { useState } from "react";
import { baseurl } from "@/lib/api/laporan";
import { EyeIcon } from "lucide-react";
import { useAllKelas } from "@/lib/hooks/useClass";
import Link from "next/link";
import Image from "next/image";

// 1. Definisikan Interface sesuai struktur data API Anda
interface Guru {
  id: number;
  name: string;
  nip: string;
  nohp: string;
  photo: string;
}

interface KelasItem {
  id: number;
  nama: string;
  masuk: string; // ISO String
  keluar: string; // ISO String
  guru: Guru | null;
}

export default function LaporanPage() {
  const [periode, setPeriode] = useState<string>("1");
  
  // 2. Berikan tipe pada data yang di-fetch
  // Jika useAllKelas belum memiliki tipe bawaan, Anda bisa melakukan casting:
  const { data, isLoading, isError } = useAllKelas();
  const kelas = data as KelasItem[];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800">Laporan Absensi</h1>
            <p className="text-sm text-gray-500 mt-1">
              Generate laporan absensi siswa berdasarkan periode.
            </p>
          </div>

          {/* Form Laporan */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Pilih Periode Laporan</label>
                <select
                  value={periode}
                  onChange={(e) => setPeriode(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                >
                  <option value="6">Harian</option>
                  <option value="1">Mingguan</option>
                  <option value="2">Bulanan</option>
                  <option value="3">3 Bulan</option>
                  <option value="4">Semesteran</option>
                  <option value="5">Tahunan</option>
                </select>
              </div>

              <div>
                <a
                  href={`${baseurl}/laporan/admin-laporan?periode=${periode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-center"
                >
                  Generate Laporan
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Laporan */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Detail Laporan Kelas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-800 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Ruangan</th>
                  <th className="px-6 py-4">Guru</th>
                  <th className="px-6 py-4">Masuk</th>
                  <th className="px-6 py-4">Keluar</th>
                  <th className="px-6 py-4">Total Sesi</th>
                  <th className="px-6 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500">Memuat data...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-red-500">Gagal mengambil data.</td>
                  </tr>
                ) : (
                  kelas?.map((item: KelasItem, index: number) => {
                    // Logika Waktu & Tanggal
                    const dateObjMasuk = item.masuk ? new Date(item.masuk) : null;
                    const dateObjKeluar = item.keluar ? new Date(item.keluar) : null;

                    const tanggal = dateObjMasuk
                      ? dateObjMasuk.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-";

                    const jamMasuk = dateObjMasuk
                      ? dateObjMasuk.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                      : "--:--";
                    
                    const jamKeluar = dateObjKeluar
                      ? dateObjKeluar.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                      : "--:--";

                    let totalSesiDisplay = "-";
                    if (dateObjMasuk && dateObjKeluar) {
                      const diffMs = dateObjKeluar.getTime() - dateObjMasuk.getTime();
                      const diffMins = Math.floor(diffMs / 60000);
                      totalSesiDisplay = diffMins > 60 
                        ? `${Math.floor(diffMins / 60)} jam ${diffMins % 60} mnt` 
                        : `${diffMins} menit`;
                    }

                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium">{index + 1}</td>
                        <td className="px-6 py-4 text-xs">{tanggal}</td>
                        <td className="px-6 py-4 font-semibold text-gray-800">{item.nama}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                              <Image
                                src={item.guru?.photo && item.guru.photo !== "default"
                                    ? `https://jokilek.diskon.com/storage/files/${item.guru.photo}`
                                    : "/default.jpeg"
                                }
                                alt={item.guru?.name || "Guru"}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 leading-tight">
                                {item.guru?.name || "Belum Ada Guru"}
                              </p>
                              <p className="text-[10px] text-gray-500">NIP: {item.guru?.nip || "-"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-green-600 font-bold">{jamMasuk}</td>
                        <td className="px-6 py-4 text-red-600 font-bold">{jamKeluar}</td>
                        <td className="px-6 py-4 font-medium text-gray-700">{totalSesiDisplay}</td>
                        <td className="px-6 py-4 font-medium">
                          <Link
                            href={`/admin/laporan/kelas/${item.id}?tanggal=${tanggal}&ruangan=${item.nama}&guru=${item.guru?.name}&masuk=${jamMasuk}&keluar=${jamKeluar}&totalSesi=${totalSesiDisplay}`}
                            className="flex items-center gap-2 group cursor-pointer"
                          >
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                              <EyeIcon className="w-4 h-4" />
                            </div>
                            <p className="text-gray-600 text-xs font-semibold group-hover:text-primary">Detail</p>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 text-center text-gray-500 text-sm">
            Menampilkan {kelas?.length || 0} data terbaru
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}