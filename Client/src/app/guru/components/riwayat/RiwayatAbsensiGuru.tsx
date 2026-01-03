"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import TableAbsensi from "./TableAbsensi";
import { useKelasAjar } from "@/lib/hooks/useClass";

interface KelasAjar {
  id: number;
  masuk: string | null;
  keluar: string | null;
  nama?: string;
}

export default function RiwayatAbsensiGuru() {
  const { data: kelasAjar, isLoading, isError } = useKelasAjar();

  // Memproses data langsung tanpa filter state
  const historyData = useMemo(() => {
    if (!kelasAjar || !Array.isArray(kelasAjar)) return [];

    return kelasAjar.map((item: KelasAjar) => {
      const dateMasuk = item.masuk ? new Date(item.masuk) : null;
      const dateKeluar = item.keluar ? new Date(item.keluar) : null;

      // Format Tanggal: 12 Jan 2024
      const tglCantik = dateMasuk 
        ? dateMasuk.toLocaleDateString('id-ID', { 
            day: '2-digit', month: 'short', year: 'numeric' 
          }) 
        : "-";

      // Format Jam: 08:00
      const jamMasuk = dateMasuk 
        ? dateMasuk.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) 
        : "-";
      
      const jamKeluar = dateKeluar 
        ? dateKeluar.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) 
        : "-";

      // Hitung Durasi Sesi
      let totalSesi = "-";
      if (dateMasuk && dateKeluar) {
        const diffInMins = Math.floor((dateKeluar.getTime() - dateMasuk.getTime()) / (1000 * 60));
        totalSesi = diffInMins >= 60 
          ? `${Math.floor(diffInMins / 60)}j ${diffInMins % 60}m` 
          : `${diffInMins}m`;
      }

      return {
        id: item.id,
        tanggal: tglCantik,
        ruangan: item.nama || "Tanpa Nama",
        masuk: jamMasuk,
        keluar: jamKeluar,
        totalSesi: totalSesi,
      };
    });
  }, [kelasAjar]);

  if (isLoading) return <div className="p-10 text-center animate-pulse text-gray-500 font-medium">Memuat data absensi...</div>;
  if (isError) return <div className="p-10 text-center text-red-500 font-semibold">Gagal mengambil data dari server.</div>;

  return (
    <motion.div
      className="space-y-6 p-4 md:p-0"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">
          Riwayat Absensi
        </h1>
        <p className="text-sm text-gray-500 mt-1">Daftar lengkap kehadiran pengajaran Anda.</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {historyData.length > 0 ? (
          <TableAbsensi data={historyData} />
        ) : (
          <div className="p-16 text-center">
            <p className="text-gray-400">Belum ada riwayat absensi yang tercatat.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}