'use client';

import { TrendingUp, Clock, XCircle, Users } from 'lucide-react';
import { LaporanSummary } from '@/types/laporan';

interface LaporanSummaryCardsProps {
  summary: LaporanSummary;
}

export default function LaporanSummaryCards({ summary }: LaporanSummaryCardsProps) {
  const cards = [
    {
      id: 1,
      title: 'Rata-rata Kehadiran',
      value: summary.rataRataKehadiran,
      subtitle: 'Rata-rata Kehadiran',
      icon: TrendingUp,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-700',
    },
    {
      id: 2,
      title: 'Total Keterlambatan',
      value: summary.totalKeterlambatan.toString(),
      subtitle: 'Total Keterlambatan',
      icon: Clock,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      valueColor: 'text-yellow-700',
    },
    {
      id: 3,
      title: 'Jumlah Alfa',
      value: summary.jumlahAlfa.toString(),
      subtitle: 'Jumlah Alfa',
      icon: XCircle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      valueColor: 'text-red-700',
    },
    {
      id: 4,
      title: 'Total Siswa',
      value: summary.totalSiswa.toString(),
      subtitle: 'Total Siswa',
      icon: Users,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      valueColor: 'text-green-700',
    },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`${card.bgColor} rounded-xl p-5 border border-gray-100 transition-transform hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={24} className={card.iconColor} />
              </div>
              <div className={`text-3xl font-bold ${card.valueColor} mb-1`}>
                {card.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {card.subtitle}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}