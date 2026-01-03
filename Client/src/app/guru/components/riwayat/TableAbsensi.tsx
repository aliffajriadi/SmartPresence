"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

interface AbsensiData {
  id: number;
  tanggal: string;
  ruangan: string;
  masuk: string;
  keluar: string;
  totalSesi: string;
}

interface TableAbsensiProps {
  data: AbsensiData[];
}

export default function TableAbsensi({ data }: TableAbsensiProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      {/* Header tabel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
          <span>Daftar Sesi Kelas</span>
        </h3>
      </div>

      {/* Tabel data */}
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-primary border-b border-gray-100">
              <th className="p-4 font-semibold">Tanggal</th>
              <th className="p-4 font-semibold">Ruangan</th>
              <th className="p-4 font-semibold">Masuk</th>
              <th className="p-4 font-semibold">Keluar</th>
              <th className="p-4 font-semibold">Total Sesi</th>
              <th className="p-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="hover:bg-indigo-50/20 transition duration-150 group"
                >
                  <td className="p-4 text-gray-600 whitespace-nowrap">{item.tanggal}</td>
                  <td className="p-4 font-medium text-gray-900">{item.ruangan}</td>
                  <td className="p-4 text-gray-700">
                    <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
                      {item.masuk}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700">
                    <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-medium">
                      {item.keluar}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">{item.totalSesi}</td>
                  <td className="p-4 text-center">
                    <Link 
                      href={`/guru/riwayat/${item.id}`}
                      className="inline-flex items-center space-x-1 text-primary hover:scale-110 transition-all hover:text-indigo-800 font-medium"
                    >
                      <Eye size={14} />
                      <span>Lihat</span>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-12">
                  <div className="flex flex-col items-center">
                    <p className="text-lg font-medium text-gray-400">Tidak ada data ditemukan</p>
                    <p className="text-sm">Silakan sesuaikan filter Anda.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}