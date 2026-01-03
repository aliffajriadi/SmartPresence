"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getStatistik } from "@/lib/api/laporan";
import { useQuery } from "@tanstack/react-query";
import { StatistikDashboard } from "@/types/StatistikDashboard";
import Image from "next/image";

export default function AttendanceChart() {
  const { data, isLoading, isError } = useQuery<StatistikDashboard[]>({
    queryKey: ["statistik"],
    queryFn: getStatistik,
    staleTime: 1000 * 60, // 1 menit
  });

  const attendanceData =
    data?.map((item) => ({
      day: new Date(item.tanggal).toLocaleDateString("id-ID", {
        weekday: "short",
      }),
      tepat: item.hadirTepat,
      terlambat: item.terlambat,
    })) || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Statistik Kehadiran Minggu Ini
        </h2>
        <p className="text-sm text-gray-500">
          Grafik kehadiran siswa dalam 7 hari terakhir
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : isError ? (
        <div className="flex flex-col justify-center items-center h-64 text-center">
          <Image
            src="/hmq.png.webp"
            alt="Error"
            width={300}
            height={300}
            className="mb-4"
          />
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Gagal memuat data
          </h3>
          <p className="text-gray-500">
            Terjadi kesalahan saat mengambil statistik kehadiran. Silakan coba
            lagi nanti.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Bar dataKey="tepat" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="terlambat" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
