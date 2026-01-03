'use client';

import { UserPlus, GraduationCap, BookOpen } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    { label: '+ Tambah Siswa', icon: UserPlus },
    { label: '+ Tambah Guru', icon: GraduationCap },
    { label: '+ Buat Kelas', icon: BookOpen },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {actions.map((action, idx) => (
        <button
          key={idx}
          className="bg-primary from-blue-700 to-blue-800 hover:opacity-90 hover:to-blue-900 text-white rounded-xl p-6 flex items-center justify-center gap-3 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          <action.icon className="w-5 h-5" />
          <span className="font-semibold">{action.label}</span>
        </button>
      ))}
    </div>
  );
}