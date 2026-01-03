"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  UserCheck,
  UserX,
  RefreshCw,
  Calendar,
  Timer,
} from "lucide-react";
import Image from "next/image";
import Header from "./components/layout/layout";
import { useActiveSession } from "@/lib/hooks/useClass";

interface Student {
  id: number;
  name: string;
  nisn?: string;
  photo?: string;
  status: "hadir" | "belum" | "terlambat";
  absenMasuk?: string;
  rfid?: {
    rfid: string;
  };
}

interface Session {
  id: number;
  kelasNama: string;
  masuk: string;
  keluar: string;
  expiredAt: string;
  totalSiswa: number;
  siswaHadir: number;
  students: Student[];
}
// Interface untuk struktur data dari API (Raw Data)
interface RawAbsensi {
  status: boolean;
  masuk: string | null;
  user: {
    id: number;
    name: string;
    nisn: string;
    photo: string;
    rfid: {
      rfid: string;
    } | null;
  };
}

interface RawSessionData {
  id: number;
  nama: string;
  masuk: string;
  expiredAt: string;
  absensi: RawAbsensi[];
}
export default function DashboardGuruPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  console.log(currentTime);

  // Menggunakan useActiveSession dari Tanstack Query
  const {
    data: apiData,
    isLoading,
    isError,
    refetch,
  } = useActiveSession();

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Transform API data ke format Session
  const activeSession = useMemo(() => {
    if (!apiData?.success || !apiData?.data) {
      return null;
    }

    const data = apiData.data as RawSessionData;

    return {
      id: data.id,
      kelasNama: data.nama,
      masuk: data.masuk,
      keluar: data.expiredAt, // Sesuaikan jika ada field keluar yang terpisah
      expiredAt: data.expiredAt,
      totalSiswa: data.absensi.length, // Atau ambil dari field lain jika ada
      siswaHadir: data.absensi.filter((a: RawAbsensi) => a.status).length,
      students: data.absensi.map((absen: RawAbsensi) => ({
        id: absen.user.id,
        name: absen.user.name,
        nisn: absen.user.nisn,
        photo: absen.user.photo,
        status: absen.status ? "hadir" : "belum",
        absenMasuk: absen.masuk,
        rfid: absen.user.rfid,
      })),
    } as Session;
  }, [apiData]);

  const handleRefresh = () => {
    refetch();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeRemaining = (expiredAt: string) => {
    const now = new Date();
    const expired = new Date(expiredAt);
    const diff = expired.getTime() - now.getTime();

    if (diff <= 0) return "Waktu habis";

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  };


  // Error State
  if (isLoading || isError) {
    return (
      <Header>
        <div className="">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Dekorasi Atas dengan warna yang lebih tenang (Biru ke Indigo) */}
            <div className="h-2 bg-gradient-to-r from-primary to-indigo-500" />

            <div className="flex flex-col items-center justify-center p-12 text-center">
              {/* Visual Ikon yang Ramah */}
              <div className="relative mb-8">
                {/* Efek pendaran cahaya biru muda */}
                <div className="absolute inset-0 bg-primary rounded-full blur-3xl opacity-60" />

                <div className="relative bg-white p-6 rounded-full border border-blue-50 shadow-xl shadow-blue-100/50">
                  <Clock className="w-12 h-12 text-primary animate-pulse" />
                </div>

                <div className="absolute -bottom-1 -right-1 bg-primary p-2 rounded-full shadow-lg border-2 border-white">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-2 mb-8">
                <h3 className="text-2xl font-bold text-gray-800">
                  Sesi Kelas Belum Dimulai
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Halaman ini akan otomatis menampilkan data kehadiran siswa
                  secara realtime setelah sesi kelas dibuka.
                </p>
              </div>

              {/* Status Badge */}
              <div className="mb-8 px-4 py-1.5 bg-blue-50 text-primary rounded-full text-sm font-medium border border-blue-100 inline-flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                Menunggu Aktivasi Sesi
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/80 transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                  <RefreshCw className="w-4 h-4" />
                  Perbarui Status
                </button>

                <button className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-gray-600 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all active:scale-95">
                  Jadwal Mengajar
                </button>
              </div>

              {/* Footer Info */}
              <p className="mt-12 text-xs text-gray-400 italic">
                Sistem akan mengecek ketersediaan sesi secara otomatis setiap
                beberapa detik.
              </p>
            </div>
          </div>
        </div>
      </Header>
    );
  }

  // No Active Session
  if (!activeSession) {
    return (
      <Header>
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Activity className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Tidak Ada Sesi Aktif
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                Belum ada sesi kelas yang sedang berlangsung. Buka sesi baru
                untuk memulai pemantauan kehadiran siswa.
              </p>
            </div>
          </div>
        </div>
      </Header>
    );
  }

  const studentsHadir = activeSession.students.filter(
    (s) => s.status === "hadir"
  );
  const studentsTerlambat = activeSession.students.filter(
    (s) => s.status === "terlambat"
  );
  const studentsBelum = activeSession.students.filter(
    (s) => s.status === "belum"
  );

  return (
    <Header>
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Monitoring Realtime</h1>
                <p className="text-white/90">
                  Sesi Kelas: {activeSession.kelasNama}
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4" />
                <p className="text-xs text-white/80">Total Siswa</p>
              </div>
              <p className="text-2xl font-bold">{activeSession.totalSiswa}</p>
            </div>

            <div className="bg-white/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <UserCheck className="w-4 h-4" />
                <p className="text-xs text-white/80">Hadir</p>
              </div>
              <p className="text-2xl font-bold">
                {studentsHadir.length + studentsTerlambat.length}
              </p>
            </div>

            <div className="bg-white/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <UserX className="w-4 h-4" />
                <p className="text-xs text-white/80">Terlambat</p>
              </div>
              <p className="text-2xl font-bold">{studentsBelum.length}</p>
            </div>

            <div className="bg-white/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Timer className="w-4 h-4" />
                <p className="text-xs text-white/80">Sisa Waktu</p>
              </div>
              <p className="text-lg font-bold">
                {getTimeRemaining(activeSession.expiredAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Informasi Sesi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Waktu Mulai</p>
              <p className="font-semibold text-gray-800">
                {formatTime(activeSession.masuk)}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Waktu Selesai</p>
              <p className="font-semibold text-gray-800">
                {formatTime(activeSession.keluar)}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-700 mb-1">Batas Absen</p>
              <p className="font-semibold text-yellow-800">
                {formatTime(activeSession.expiredAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Students List with Tabs */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Daftar Kehadiran Siswa
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                <span>Live Update</span>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm whitespace-nowrap">
              Semua ({activeSession.students.length})
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors whitespace-nowrap">
              Tepat Waktu ({studentsHadir.length})
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors whitespace-nowrap">
              Terlambat ({studentsTerlambat.length})
            </button>
          </div>

          {/* Students Grid */}
          <div className="space-y-2">
            {activeSession.students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        </div>
      </div>
    </Header>
  );
}

function StudentCard({ student }: { student: Student }) {
  const [isLoading, setIsLoading] = useState(true);

  const finalPhoto = student.photo ?? "default";
  const src =
    finalPhoto === "default"
      ? "/default.jpeg"
      : `https://jokilek.diskon.com/storage/files/${finalPhoto}`;

  const formatTime = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "hadir":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Hadir
          </span>
        );
      case "terlambat":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            Terlambat
          </span>
        );
      case "belum":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Belum Hadir
          </span>
        );
    }
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
        student.status === "hadir"
          ? "bg-green-50/50 border-green-200 hover:bg-green-50"
          : student.status === "terlambat"
          ? "bg-yellow-50/50 border-yellow-200 hover:bg-yellow-50"
          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
      }`}
    >
      <div className="relative w-12 h-12 overflow-hidden rounded-full ring-2 ring-white flex-shrink-0">
        {isLoading && (
          <div className="absolute inset-0 rounded-full bg-gray-300 animate-pulse" />
        )}
        <Image
          src={src}
          alt={student.name}
          width={48}
          height={48}
          className={`rounded-full object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoadingComplete={() => setIsLoading(false)}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800">{student.name}</h3>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
          {student.nisn && <span>NISN: {student.nisn}</span>}
          {student.rfid?.rfid && (
            <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">
              {student.rfid.rfid}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {student.absenMasuk && (
          <div className="text-right">
            <p className="text-xs text-gray-600">Absen</p>
            <p className="text-sm font-semibold text-gray-800">
              {formatTime(student.absenMasuk)}
            </p>
          </div>
        )}
        {getStatusBadge(student.status)}
      </div>
    </div>
  );
}
