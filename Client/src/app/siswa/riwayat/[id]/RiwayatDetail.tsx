"use client";

import { useAbsensiClassDetail } from "@/lib/hooks/useClass";
import {
  CalendarDays,
  Clock,
  User,
  Phone,
  IdCard,
  School,
  LogIn,
  LogOut,
  CheckCircle2,
  ArrowLeft,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Absensi } from "@/types/Guru";
import { motion } from "framer-motion";
interface ViewProps {
  id: number;
}

export default function RiwayatDetailView({ id }: ViewProps) {
  const { data, isLoading, isError } = useAbsensiClassDetail(id);

  const BackButton = () => (
    <div className="sticky top-0 left-0 z-20">
      <Link
        href="/siswa/riwayat"
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors px-3 py-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium text-sm">Kembali ke Halaman Riwayat</span>
      </Link>
    </div>
  );

  // Wrapper relatif supaya tombol absolute bisa tetap di kiri atas
  return (
    <div className="relative min-h-screen">
      {/* Back Button selalu muncul */}
      <BackButton />

      {isLoading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">Memuat data...</p>
          </div>
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
            <div className="flex items-center gap-3 text-red-600 mb-2">
              <XCircle className="w-6 h-6" />
              <h3 className="font-semibold text-lg">Terjadi Kesalahan</h3>
            </div>
            <p className="text-red-700">
              Gagal memuat data absensi. Silakan coba lagi.
            </p>
          </div>
        </div>
      )}

      {data && <DetailContent data={data} />}
    </div>
  );
}

// Pisahkan konten utama biar rapi
function DetailContent({ data }: { data: Absensi }) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const calculateDuration = (masuk: string, keluar: string) => {
    const start = new Date(masuk);
    const end = new Date(keluar);
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} jam ${minutes} menit`;
  };

  return (
    <motion.div
      className="space-y-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-6 mt-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <CalendarDays className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Detail Riwayat Absensi</h1>
          </div>
          <p className="text-white/90">ID Absensi: #{data.id}</p>
        </div>

        {/* Status Kehadiran & Informasi Kelas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Kehadiran */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Status Kehadiran
              </h2>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  data.status
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {data.status ? "Tepat Waktu" : "Terlambat"}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <LogIn className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Waktu Masuk</p>
                  <p className="font-semibold text-gray-800">
                    {formatTime(data.masuk)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(data.masuk)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <LogOut className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Waktu Keluar</p>
                  <p className="font-semibold text-gray-800">
                    {formatTime(data.keluar)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(data.keluar)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Durasi Kehadiran</p>
                  <p className="font-semibold text-gray-800">
                    {calculateDuration(data.masuk, data.keluar)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informasi Kelas */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <School className="w-5 h-5 text-primary" />
              Informasi Kelas
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-gray-600 mb-1">Nama Kelas</p>
                <p className="text-2xl font-bold text-gray-800">
                  {data.kelas.nama}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Jam Masuk Kelas</p>
                  <p className="font-medium text-gray-800">
                    {formatTime(data.kelas.masuk)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Jam Keluar Kelas</p>
                  <p className="font-medium text-gray-800">
                    {formatTime(data.kelas.keluar)}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-gray-600 mb-1">Batas Waktu Absen</p>
                <p className="font-medium text-gray-800">
                  {formatTime(data.kelas.expiredAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informasi Guru Pengajar */}
        <div className="bg-white rounded-xl mb-15 p-6 shadow-sm border border-gray-200 w-full">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-primary shrink-0" />
            Guru Pengajar
          </h2>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="shrink-0">
              <FotoGuru
                photo={data.kelas.guru.photo}
                name={data.kelas.guru.name}
              />
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-500 mb-1">Nama Lengkap</p>
                <p className="text-lg font-bold text-gray-800 break-words">
                  {data.kelas.guru.name}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                  <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
                    <IdCard className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">NIP</p>
                    <p
                      className="font-medium text-gray-800 text-sm truncate"
                      title={data.kelas.guru.nip}
                    >
                      {data.kelas.guru.nip || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                  <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">No. Telepon</p>
                    <p
                      className="font-medium text-gray-800 text-sm truncate"
                      title={data.kelas.guru.nohp}
                    >
                      {data.kelas.guru.nohp || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FotoGuru({ photo, name }: { photo?: string; name?: string }) {
  const [isLoading, setIsLoading] = useState(true);

  const finalName = name ?? "Guru";
  const finalPhoto = photo ?? "default";

  const src =
    finalPhoto === "default"
      ? "/default.jpeg"
      : `https://jokilek.diskon.com/storage/files/${finalPhoto}`;

  return (
    <div className="relative w-24 h-24 overflow-hidden rounded-full ring-4 ring-primary/20">
      {isLoading && (
        <div className="absolute inset-0 rounded-full bg-gray-200 animate-pulse" />
      )}

      <Image
        src={src}
        alt={finalName}
        width={96}
        height={96}
        className={`rounded-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
}
