'use client';

import { use, useState, useEffect } from 'react'; // Tambahkan 'use'
import AdminLayout from '../../../component/layout/Layout';
import SiswaForm from '../../../component/siswa/FormSiswa';
import { getUserById } from '@/lib/api/user'; 
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Definisi Props: params adalah Promise di Next.js 15
interface PageProps {
  params: Promise<{ nisn: string }>;
}

export default function EditSiswaPage({ params }: PageProps) {
  // 1. UNWRAP PARAMS (Wajib di Next.js 15)
  // Gunakan hook 'use' untuk membuka bungkusan Promise params
  const resolvedParams = use(params);
  const userId = resolvedParams.nisn; // Ini berisi ID user (karena kita kirim ID di URL)

  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Fetch Data Siswa Berdasarkan ID
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        // Panggil API getUserById
        const data = await getUserById(Number(userId));
        setStudentData(data);
      } catch (error) {
        console.error("Gagal mengambil data siswa:", error);
        alert("Gagal memuat data siswa.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-gray-500">Loading data untuk diedit...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Tombol Kembali */}
        <div className="mb-6">
          <Link 
            href="/admin/data-siswa" 
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4 w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali ke Data Siswa</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Edit Data Siswa</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Panggil Form dalam mode Edit */}
          {studentData ? (
            <SiswaForm mode="edit" initialData={studentData} />
          ) : (
            <div className="text-red-500 text-center py-8">Data siswa tidak ditemukan</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}