"use client";

import { CheckCircle, XCircle } from "lucide-react";

interface AbsensiData {
  tepatWaktu: number;
  terlambat: number;
}

interface Props {
  data?: AbsensiData;
}

export default function RingkasanKehadiran({ data }: Props) {
  if (!data) return null;

  const date = new Date();

  const cards = [
    {
      title: "Total Hadir",
      value: data.tepatWaktu,
      icon: <CheckCircle className="w-6 h-6 text-green-600/70" />,
      bg: "bg-green-50/40 border-green-100",
    },
    {
      title: "Total Terlambat",
      value: data.terlambat,
      icon: <XCircle className="w-6 h-6 text-red-600/70" />,
      bg: "bg-red-50/40 border-red-100",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border shadow-sm hover:shadow-md transition duration-150 flex items-center gap-4 ${card.bg}`}
          >
            <div className="p-3 rounded-full bg-white border shadow-sm">
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500">
  Absensi Bulan ini, tanggal 1 – {date.getDate()}{" "}
  {date.toLocaleDateString("id-ID", { month: "long" })}{" "}
  {date.getFullYear()}
</p>

    </div>
  );
}
