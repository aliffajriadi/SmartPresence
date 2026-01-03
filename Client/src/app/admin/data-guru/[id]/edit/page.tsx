'use client';

import React from "react";
import AdminLayout from '../../../component/layout/Layout';
import TeacherForm from '../../../component/guru/FormGuru';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Teacher } from '@/types/Guru';
import { getUserById } from '@/lib/api/user';

interface EditTeacherPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTeacherPage({ params }: EditTeacherPageProps) {
  const router = useRouter();

  // Unwrap params
  const { id } = React.use(params);

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const data = await getUserById(Number(id));

        setTeacher({
          id: data.id.toString(),
          nip: data.nip,
          nama: data.name,
          nohp: data.nohp,
          rfid: data.rfid,
          role: data.role,
        });
      } catch (e) {
        console.error(e);
        setTeacher(null);
      }
      setIsLoading(false);
    };

    fetchTeacher();
  }, [id]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!teacher) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Data guru tidak ditemukan</p>
          <button
            onClick={() => router.push('/admin/data-guru')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Kembali ke Daftar Guru
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Kembali</span>
        </button>

        <h1 className="text-2xl font-bold text-gray-800">Edit Data Guru</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <TeacherForm mode="edit" initialData={teacher} />
      </div>
    </AdminLayout>
  );
}
