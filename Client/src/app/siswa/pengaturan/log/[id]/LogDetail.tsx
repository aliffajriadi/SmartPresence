'use client'

import { useLogsActivityDetail } from "@/lib/hooks/useUser"
import { 
  Activity, 
  Monitor, 
  Smartphone, 
  Calendar,
  Clock,
  MapPin,
  Laptop,
  Apple,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Info
} from "lucide-react";
import Link from "next/link";

interface LogDetailProps {
  id: number
}

interface LogData {
  id: number;
  userid: number;
  os: string;
  browser: string;
  ip: string;
  platform: string;
  isMobile: boolean;
  aktivitas: string;
  createdAt: string;
}

const LogDetail = ({ id }: LogDetailProps) => {
  const { data, isLoading, isError } = useLogsActivityDetail(id)

  const getActivityLabel = (activity: string) => {
    const labels: Record<string, string> = {
      login: "Login ke Sistem",
      logout: "Logout dari Sistem",
      update_photo_profile: "Update Foto Profil",
      update_profile: "Update Profil",
      create_user: "Tambah User Baru",
      delete_user: "Hapus User",
      update_password: "Ubah Password",
    };
    return labels[activity] || activity.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const getActivityIcon = (activity: string) => {
    if (activity.includes("login")) return <CheckCircle2 className="w-6 h-6 text-green-600" />;
    if (activity.includes("logout")) return <Activity className="w-6 h-6 text-red-600" />;
    if (activity.includes("update")) return <Activity className="w-6 h-6 text-blue-600" />;
    return <Activity className="w-6 h-6 text-gray-600" />;
  };

  const getOSIcon = (os: string) => {
    const osLower = os.toLowerCase();
    if (osLower.includes("linux")) return <Laptop className="w-5 h-5 text-orange-600" />;
    if (osLower.includes("windows")) return <Monitor className="w-5 h-5 text-blue-600" />;
    if (osLower.includes("mac") || osLower.includes("darwin")) return <Apple className="w-5 h-5 text-gray-700" />;
    if (osLower.includes("android")) return <Smartphone className="w-5 h-5 text-green-600" />;
    if (osLower.includes("ios")) return <Smartphone className="w-5 h-5 text-gray-700" />;
    return <Monitor className="w-5 h-5 text-gray-600" />;
  };

  const getBrowserIcon = (browser: string) => {
    const browserLower = browser.toLowerCase();
    if (browserLower.includes("chrome")) return "🌐";
    if (browserLower.includes("firefox")) return "🦊";
    if (browserLower.includes("safari")) return "🧭";
    if (browserLower.includes("edge")) return "🔷";
    return "💻";
  };
  const BackButton = () => (
    <div className="sticky top-0 left-0 z-20">
      <Link
        href="/siswa/"
        className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors px-3 py-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium text-sm">Kembali ke Halaman Dashboard</span>
      </Link>
    </div>
  );

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }),
      time: date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      })
    };
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <BackButton />
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 animate-pulse" />
            <div>
              <h1 className="text-2xl font-bold">Detail Log Aktivitas</h1>
              <p className="text-white/90">Memuat data...</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !data) {
    return (
      <div className="space-y-6">
        <BackButton />
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Detail Log Aktivitas</h1>
              <p className="text-white/90">Gagal memuat data</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Gagal Memuat Data
            </h3>
            <p className="text-gray-600">
              Terjadi kesalahan saat mengambil detail log aktivitas
            </p>
          </div>
        </div>
      </div>
    );
  }

  const logData = data as LogData;
  const dateTime = formatDateTime(logData.createdAt);

  return (
    <div className="space-y-6">
      {/* Header */}
      <BackButton />
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Detail Log Aktivitas</h1>
        </div>
        <p className="text-white/90">ID Log: #{logData.id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informasi Aktivitas */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-primary" />
            Informasi Aktivitas
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              {getActivityIcon(logData.aktivitas)}
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Jenis Aktivitas</p>
                <p className="text-xl font-bold text-gray-800">
                  {getActivityLabel(logData.aktivitas)}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Tanggal</p>
                  <p className="font-semibold text-gray-800">{dateTime.date}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Waktu</p>
                  <p className="font-semibold text-gray-800">{dateTime.time} WIB</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-700 mb-1">User ID</p>
                  <p className="font-semibold text-blue-800">{logData.userid}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informasi Perangkat */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            {logData.isMobile ? (
              <Smartphone className="w-5 h-5 text-primary" />
            ) : (
              <Monitor className="w-5 h-5 text-primary" />
            )}
            Informasi Perangkat
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                {getOSIcon(logData.os)}
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Sistem Operasi</p>
                  <p className="font-semibold text-gray-800">{logData.os}</p>
                  <p className="text-xs text-gray-500 mt-1">Platform: {logData.platform}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getBrowserIcon(logData.browser)}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Browser</p>
                  <p className="font-semibold text-gray-800">{logData.browser}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                {logData.isMobile ? (
                  <Smartphone className="w-5 h-5 text-green-600" />
                ) : (
                  <Monitor className="w-5 h-5 text-blue-600" />
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Tipe Perangkat</p>
                  <p className="font-semibold text-gray-800">
                    {logData.isMobile ? "Perangkat Mobile" : "Desktop/Laptop"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-purple-700 mb-1">IP Address</p>
                  <p className="font-mono font-semibold text-purple-800">{logData.ip}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan</h2>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <p className="text-gray-700 leading-relaxed">
            Aktivitas <span className="font-semibold text-primary">{getActivityLabel(logData.aktivitas)}</span> dilakukan 
            pada 
            tanggal <span className="font-semibold">{dateTime.date}</span> pukul <span className="font-semibold">{dateTime.time} WIB</span> menggunakan 
            browser <span className="font-semibold">{logData.browser}</span> pada perangkat <span className="font-semibold">{logData.platform}</span> dengan 
            IP address <span className="font-mono font-semibold">{logData.ip}</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LogDetail