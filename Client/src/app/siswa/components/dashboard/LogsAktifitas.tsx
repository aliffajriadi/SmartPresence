"use client"

import { useLogsActivity } from "@/lib/hooks/useUser";
import { 
  Activity, 
  Monitor, 
  Smartphone, 
  LogIn,
  UserCog,
  Clock,
  MapPin,
  ChevronRight,
  Laptop,
  Apple
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface LogActivity {
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

export default function LogsAktifitas() {
  const [page, setPage] = useState(1);
  const limit = 5;
  const { data, isLoading, isError } = useLogsActivity(page, limit);

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
    if (activity.includes("login")) return <LogIn className="w-4 h-4 text-green-600" />;
    if (activity.includes("update")) return <UserCog className="w-4 h-4 text-primary" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const getBrowserIcon = (browser: string) => {
    const browserLower = browser.toLowerCase();
    if (browserLower.includes("chrome")) return "🌐";
    if (browserLower.includes("firefox")) return "🦊";
    if (browserLower.includes("safari")) return "🧭";
    if (browserLower.includes("edge")) return "🔷";
    return "💻";
  };

  const getOSIcon = (os: string) => {
    const osLower = os.toLowerCase();
    if (osLower.includes("linux")) return <Laptop className="w-3 h-3 text-orange-600" />;
    if (osLower.includes("windows")) return <Monitor className="w-3 h-3 text-blue-600" />;
    if (osLower.includes("mac") || osLower.includes("darwin")) return <Apple className="w-3 h-3 text-gray-700" />;
    if (osLower.includes("android")) return <Smartphone className="w-3 h-3 text-green-600" />;
    if (osLower.includes("ios")) return <Smartphone className="w-3 h-3 text-gray-700" />;
    return <Monitor className="w-3 h-3 text-gray-600" />;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Log Aktivitas
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Log Aktivitas
        </h2>
        <div className="text-center py-8 text-gray-500">
          <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Tidak ada data aktivitas</p>
        </div>
      </div>
    );
  }

  const activities = data.data;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Log Aktivitas
        </h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {data.data.total} aktivitas
        </span>
      </div>

      <div className="space-y-2">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Belum ada aktivitas</p>
          </div>
        ) : (
          activities.map((log: LogActivity) => (
            <div
              key={log.id}
              className="group p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 cursor-pointer"
            >
              <Link href={`/siswa/pengaturan/log/${log.id}`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getActivityIcon(log.aktivitas)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-medium text-gray-800 text-sm">
                      {getActivityLabel(log.aktivitas)}
                    </p>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(log.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {log.isMobile ? (
                        <Smartphone className="w-3 h-3" />
                      ) : (
                        <Monitor className="w-3 h-3" />
                      )}
                      <span>{getBrowserIcon(log.browser)} {log.browser}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {getOSIcon(log.os)}
                      <span>{log.os}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{log.ip}</span>
                    </div>
                  </div>
                </div>
              </div>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {data.data.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-sm text-gray-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Sebelumnya
          </button>
          
          <span className="text-xs text-gray-500">
            Hal {page} dari {data.data.totalPages}
          </span>
          
          <button
            onClick={() => setPage(p => Math.min(data.data.totalPages, p + 1))}
            disabled={page === data.data.totalPages}
            className="text-sm text-gray-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Selanjutnya →
          </button>
        </div>
      )}
    </div>
  );
}