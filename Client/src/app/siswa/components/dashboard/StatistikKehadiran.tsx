"use client";

import { motion } from "framer-motion";
import { useStatistikAbsensiSiswa } from "@/lib/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function StatistikKehadiran() {
  const { data: stat, isLoading, isError } = useStatistikAbsensiSiswa();
  const tepatWaktu = stat?.tepatWaktu / (stat?.tepatWaktu + stat?.terlambat) * 100;
  const terlambat = stat?.terlambat / (stat?.tepatWaktu + stat?.terlambat) * 100;
  const data = [
    { label: "Kehadiran Tepat Waktu (Bulan ini)", value: `${tepatWaktu}%`, angka: stat?.tepatWaktu, warning: (tepatWaktu < 80) },
    { label: "Total Terlambat (Bulan ini)", value: `${terlambat}%`, angka: stat?.terlambat },
  ];
   if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            className="p-4 bg-white rounded-lg border shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/3 mb-1" />
            <Skeleton className="h-4 w-1/4" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 text-red-700"
      >
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium">Gagal memuat statistik kehadiran</h3>
          <p className="text-sm">Silakan coba lagi nanti atau hubungi admin.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      
      {data.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all"
        >
          <p className="text-sm text-gray-500 mb-1">{item.label}</p>
          <p className={`text-3xl font-bold ${terlambat > 40 ? "text-red-500" : "text-green-600"} text-[#29437c]`}>{item.value}</p>
          <p className="text-sm text-gray-500 ">Total: {item.angka}</p>
        </motion.div>
      ))}
    </div>
  );
}
