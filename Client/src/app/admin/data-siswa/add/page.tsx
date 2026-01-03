'use client';

import AdminLayout from '../../component/layout/Layout';
import SiswaForm from '../../component/siswa/FormSiswa';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddTeacherPage() {
  const router = useRouter();

  return (
    <AdminLayout>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Kembali</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Tambah Siswa Baru</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <SiswaForm mode="add" />
      </div>
    </AdminLayout>
  );
}