"use client";

import { Download, CalendarDays, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import StatusBadgeSiswa from "./StatusBadgeSiswa";
import SkeletonTable from "@/components/SkeletonTable";
import Link from "next/link";
import { baseurl } from "@/lib/api/laporan";

// Interface untuk data absensi
export interface Guru {
  name: string;
}

export interface Kelas {
  nama: string;
  guru: Guru;
}

export interface AbsensiData {
  id: number;
  masuk: string;
  keluar: string;
  status: boolean;
  kelas: Kelas;
}

interface TotalAbsensi {
  tepatWaktu: number;
  terlambat: number;
}

// Props untuk tabel
interface TableAbsensiProps {
  data: {
    absensi: AbsensiData[];
    total: TotalAbsensi;
  };
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalData?: number;
  limit?: number;
  isLoading?: boolean;
  periode?: number
}

export default function TableAbsensiSiswa({ 
  data,
  page = 1,
  totalPages = 1,
  onPageChange,
  totalData,
  limit = 10,
  isLoading,
  periode
}: TableAbsensiProps) {


   
  if (isLoading) {
    return <div className="bg-secondary">
      <SkeletonTable />
    </div>;
  }
  if (!data?.absensi || data.absensi.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-primary flex items-center space-x-2">
            <CalendarDays className="w-6 h-6 text-primary" />
            <span className="text-primary">Daftar Kehadiran</span>
          </h3>
          <button 
            className="flex items-center space-x-2 border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download size={16} />
            <span>Ekspor PDF</span>
          </button>
        </div>
        <div className="text-center py-12 text-gray-500">
          Tidak ada data kehadiran yang ditemukan
        </div>
      </div>
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + data.absensi.length, totalData ?? data.absensi.length);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-primary flex items-center space-x-2">
          <CalendarDays className="w-6 h-6 text-primary" />
          <span className="text-primary">Daftar Kehadiran</span>
        </h3>
        <a href={`${baseurl}/laporan/laporan-profile-web?periode=${periode}`} target="_blank"
          className="flex items-center space-x-2 border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Download size={16} />
          <span>Ekspor PDF</span>
        </a>
      </div>
     {/* Statistik Kehadiran */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
  <div className="bg-indigo-50 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm border border-indigo-100">
    <p className="text-sm text-gray-500">Total Kehadiran</p>
    <p className="text-2xl font-semibold text-indigo-700">
      {data.total.tepatWaktu + data.total.terlambat}
    </p>
  </div>

  <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm border border-green-100">
    <p className="text-sm text-gray-500">Tepat Waktu</p>
    <p className="text-2xl font-semibold text-green-700">{data.total.tepatWaktu}</p>
  </div>

  <div className="bg-red-50 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm border border-red-100">
    <p className="text-sm text-gray-500">Terlambat</p>
    <p className="text-2xl font-semibold text-red-700">{data.total.terlambat}</p>
  </div>
</div>


      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-xl shadow-sm min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Kelas / Ruangan</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Masuk</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Keluar</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Keterangan</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.absensi.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4 text-gray-600">
                  {new Date(item.masuk).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </td>
                <td className="py-4 px-4 font-medium text-gray-800">{item.kelas.nama}</td>
                <td className="py-4 px-4 text-gray-600">
                  {item.masuk
                    ? new Date(item.masuk).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "-"}
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {item.keluar
                    ? new Date(item.keluar).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "-"}
                </td>
                <td className="py-4 px-4">
                  <StatusBadgeSiswa status={item.status} />
                </td>
                <td className="py-4 px-4">
                  
                  <Link href={`/siswa/riwayat/${item.id}`}><Eye size={24} className="hover:scale-120 transition-transform cursor-pointer text-primary/70"/></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {onPageChange && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
          <p className="text-sm text-gray-500">
            Menampilkan{" "}
            <span className="font-medium text-gray-900">{startIndex + 1}</span>{" "}
            sampai <span className="font-medium text-gray-900">{endIndex}</span>{" "}
            dari <span className="font-medium text-gray-900">{totalData ?? data.absensi.length}</span>{" "}
            data
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === p ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
