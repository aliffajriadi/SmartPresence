'use client';

import { useStatistik } from "@/lib/hooks/useLaporan";

export default function RecentActivity() {
  const { data, isLoading, isError } = useStatistik();

  // Helper: menghitung waktu relatif (time ago)
  const timeAgo = (dateInput: string | undefined) => {
    if (!dateInput) return "-";

    const now = new Date();
    const past = new Date(dateInput);
    const diffMs = now.getTime() - past.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return "Baru saja";
    if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${diffDays} hari lalu`;
  };

  const recentActivities = [
    {
      id: 1,
      text: `Akun Baru ${data?.lastActivityCreateAccount?.name ?? "-"} Telah didaftarkan`,
      time: timeAgo(data?.lastActivityCreateAccount?.createdAt),
    },
    {
      id: 2,
      text: `Guru ${data?.lastActivityCreateClass?.guru?.name ?? "-"} Telah Membuka Sesi Kelas Pada Ruangan ${data?.lastActivityCreateClass?.nama ?? "-"}`,
      time: timeAgo(data?.lastActivityCreateClass?.masuk),
    },
    {
      id: 3,
      text: `Siswa ${data?.lastActivityJoinClass?.user?.name ?? "-"} Telah Bergabung pada Kelas ${data?.lastActivityJoinClass?.kelas?.nama ?? "-"}`,
      time: timeAgo(data?.lastActivityJoinClass?.masuk),
    },
    {
      id: 4,
      text: data?.lastActivityChangePassword?.nama ?? "-",
      time: "Beberapa saat lalu",
    },
    {
      id: 5,
      text: "Kelas Fisika 10B ditambahkan",
      time: "Beberapa saat lalu",
    },
  ];

  // Skeleton item component
  const SkeletonItem = () => (
    <div className="flex items-start gap-3 animate-pulse">
      <div className="w-2 h-2 rounded-full bg-gray-300 mt-2 flex-shrink-0"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
        <div className="h-2 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Aktivitas Terkini</h2>
      <div className="space-y-4">
        {isLoading && Array.from({ length: 5 }).map((_, idx) => <SkeletonItem key={idx} />)}

        {isError && <p className="text-red-500">Terjadi kesalahan saat memuat data</p>}

        {!isLoading && !isError && recentActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 group">
            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed group-hover:text-blue-600 transition-colors">
                {activity.text}
              </p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
