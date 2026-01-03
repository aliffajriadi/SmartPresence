"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useSiswaByKelasId } from "@/lib/hooks/useClass";
import AdminLayout from "../../../component/layout/Layout";
import { ArrowLeft, User, Clock, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// 1. Definisikan Interfaces sesuai hasil query
interface UserProfile {
  id: number;
  name: string;
  nisn: string;
  nohp: string;
  photo: string;
}

interface StudentLog {
  id: number;
  masuk: string | null;
  keluar: string | null;
  status: boolean;
  user: UserProfile; // Sesuai query: user adalah objek di dalam log
}

// Opsional: Interface untuk respons API secara keseluruhan
interface ApiResponse {
  users: StudentLog[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function DetailLaporanKelasPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Number(params.id);

  // Ambil data dari URL Query
  const queryTanggal = searchParams.get("tanggal");
  const queryRuangan = searchParams.get("ruangan");
  const queryGuru = searchParams.get("guru");
  const queryMasuk = searchParams.get("masuk");
  const queryKeluar = searchParams.get("keluar");
  const queryTotalSesi = searchParams.get("totalSesi");

  // 2. Gunakan interface pada hook (sesuaikan jika hook mendukung generic)
  const { data, isLoading } = useSiswaByKelasId(id, 1, 100);
  
  // Casting data ke tipe ApiResponse
  const responseData = data as ApiResponse;
  const studentLogs = responseData?.users || [];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header & Back Button */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin/laporan" className="p-2 bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Detail Laporan Kelas</h1>
              <p className="text-sm text-gray-500">Data kehadiran log RFID siswa.</p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><User className="w-6 h-6" /></div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Guru Pengajar</p>
                  <p className="font-bold text-gray-800">{queryGuru || "Tidak Diketahui"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-3 bg-purple-50 rounded-lg text-purple-600"><MapPin className="w-6 h-6" /></div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Ruangan</p>
                  <p className="font-bold text-gray-800">{queryRuangan || "Tidak Diketahui"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-3 bg-green-50 rounded-lg text-green-600"><Calendar className="w-6 h-6" /></div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Tanggal</p>
                  <p className="font-bold text-gray-800">{queryTanggal || "-"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-3 bg-orange-50 rounded-lg text-orange-600"><Clock className="w-6 h-6" /></div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Waktu Sesi</p>
                  <p className="font-bold text-gray-800">{queryMasuk} - {queryKeluar}</p>
                  <p className="text-[10px] text-orange-600 font-bold">{queryTotalSesi}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Daftar Kehadiran Siswa</h2>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                {studentLogs.length} Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-800 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">No</th>
                    <th className="px-6 py-4">Siswa</th>
                    <th className="px-6 py-4">NISN</th>
                    <th className="px-6 py-4 text-center">Tap Masuk</th>
                    <th className="px-6 py-4 text-center">Tap Keluar</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                     <tr>
                        <td colSpan={6} className="px-6 py-10 text-center">
                           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
                        </td>
                     </tr>
                  ) : studentLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-400 font-medium">Tidak ada data siswa.</td>
                    </tr>
                  ) : (
                    studentLogs.map((log: StudentLog, index: number) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-400 font-medium">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden relative border border-gray-200">
                              <Image
                                src={log.user?.photo && log.user.photo !== "default" 
                                  ? `https://jokilek.diskon.com/storage/files/${log.user.photo}` 
                                  : "/default.jpeg"}
                                alt={log.user?.name || "Siswa"}
                                fill
                                sizes="36px"
                                className="object-cover"
                              />
                            </div>
                            <span className="font-bold text-gray-800 uppercase text-[11px] leading-tight">
                              {log.user?.name || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-[11px] text-gray-500">{log.user?.nisn || "-"}</td>
                        <td className="px-6 py-4 text-center font-bold text-green-600">
                          {log.masuk ? new Date(log.masuk).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-red-600">
                          {log.keluar ? new Date(log.keluar).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${
                            log.status 
                              ? "bg-green-50 text-green-600 border-green-100" 
                              : "bg-yellow-50 text-yellow-600 border-yellow-100"
                          }`}>
                            {log.status ? "Tepat Waktu" : "Terlambat"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}