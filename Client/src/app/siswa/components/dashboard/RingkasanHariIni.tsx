"use client";

import { CheckCircle, Clock, Calendar, AlertCircle } from "lucide-react";
import { useLaporanAbsensiSiswa } from "@/lib/hooks/useLaporan";
import Link from "next/link";

interface AbsensiItem {
  status: boolean;
  kelas?: {
    nama: string;
  };
  masuk: string;
  keluar?: string;
  id: number;
}

export default function RingkasanHariIni() {
  const {
    data: absensi,
    isLoading,
    isError,
  } = useLaporanAbsensiSiswa(1, 10, 2);
  const data = absensi?.absensi;

  const getStatusIcon = (status: boolean) => {
    if (status) {
      return <CheckCircle className="text-primary w-5 h-5" />;
    }
    return <Clock className="text-yellow-600 w-5 h-5" />;
  };

  const getStatusBadge = (status: boolean) => {
    if (status) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          Tepat Waktu
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
        Terlambat
      </span>
    );
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5" />
          <h2 className="text-lg font-semibold text-gray-800">
            Ringkasan Kehadiran Hari Ini
          </h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">{getCurrentDate()}</p>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-50 rounded-xl p-3 border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                    <div className="h-3 w-16 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-28 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-primary w-5 h-5" />
          <h2 className="text-lg font-semibold text-gray-800">
            Ringkasan Kehadiran Hari Ini
          </h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">{getCurrentDate()}</p>

        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-medium mb-1">Gagal Memuat Data</p>
          <p className="text-sm text-gray-500">
            Terjadi kesalahan saat mengambil data kehadiran
          </p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col items-center gap-2 mb-4">
          <Calendar className="w-5 h-5" />
          <h2 className="text-lg font-semibold text-gray-800">
            Ringkasan Kehadiran Hari Ini
          </h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">{getCurrentDate()}</p>

        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium mb-1">
            Belum Ada Data Hari Ini
          </p>
          <p className="text-sm text-gray-500">
            Kehadiran belum tercatat untuk hari ini
          </p>
        </div>
      </div>
    );
  }

  // Success State with Data
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex flex-col lg:flex-row items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <h2 className="text-lg font-semibold text-gray-800">
            Ringkasan Kehadiran Hari Ini
          </h2>
        </div>
        <span className="flex px-2 gap-2 text-xs text-gray-500 bg-gray-100 py-1 rounded-full">
          <span>{data.length}</span>
          <span>Kelas</span>
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-4">{getCurrentDate()}</p>

      <div className="space-y-3">
        {data.map((item: AbsensiItem, i: number) => (
          <Link
            key={i}
            href={`/siswa/riwayat/${item.id}`}
            className="group flex justify-between items-center bg-gray-50 hover:bg-primary/5 transition-all rounded-xl p-4 border border-gray-200 hover:border-primary/30 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="transition-transform group-hover:scale-110">
                {getStatusIcon(item.status)}
              </div>
              <div>
                <div className="flex items-center lg:hidden">
                  <p className="font-semibold text-gray-800">
                    {item.kelas?.nama || "Kelas Tidak Diketahui"}
                  </p>
                  {getStatusBadge(item.status)}
                </div>
                <p className="font-semibold hidden lg:block text-gray-800">
                  {item.kelas?.nama || "Kelas Tidak Diketahui"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-500">
                    Absen masuk: {formatDateTime(item.masuk)}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:flex hidden items-center gap-3">
              {getStatusBadge(item.status)}
            </div>
          </Link>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-green-700">Tepat Waktu</p>
                <p className="text-lg font-bold text-green-800">
                  {absensi?.total?.tepatWaktu || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <div>
                <p className="text-xs text-yellow-700">Terlambat</p>
                <p className="text-lg font-bold text-yellow-800">
                  {absensi?.total?.terlambat || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
