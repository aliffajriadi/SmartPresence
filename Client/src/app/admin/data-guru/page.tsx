"use client";

import { useState, useEffect, useRef } from "react";
import AdminLayout from "../component/layout/Layout";
import TeachersTable from "../component/guru/TableGuru";
import TableHeaderControls from "../component/guru/TableHeaderControls";
import SkeletonTable from "@/components/SkeletonTable";
import { useUserQuery } from "@/lib/hooks/useUser";
import { Teacher } from "@/types/Guru";

export default function TeachersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;
  const role = "guru";

  // 🔥 mencegah reset page kalau user klik pagination
  const isFromPagination = useRef(false);

  const handlePageChange = (p: number) => {
    isFromPagination.current = true;
    setPage(p);
  };

  // 🕒 Debounce 1 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isFromPagination.current) {
        setPage(1);
      }
      setSearch(searchInput);
      isFromPagination.current = false;
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Ambil data
  const { data, isLoading, isError } = useUserQuery(
    page.toString(),
    limit.toString(),
    role
  );

  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);

  // Filter data berdasarkan search
  useEffect(() => {
    if (data?.users) {
      let teachers = data.users.filter(
        (u: Teacher) => u.role?.toLowerCase() === "guru"
      );

      if (search.trim().length > 0) {
        const q = search.toLowerCase();
        teachers = teachers.filter(
          (t: Teacher) =>
            t.name?.toLowerCase().includes(q) ||
            t.nip?.toLowerCase().includes(q)
        );
      }

      setFilteredTeachers(teachers);
    }
  }, [data, search]);

  // Loading
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex justify-between items-center pb-4">
            <h3 className="text-2xl font-bold text-primary">Data Guru</h3>
            <p className="text-gray-500 animate-pulse text-sm">
              Sedang Memuat Data...
            </p>
          </div>
          <SkeletonTable rows={10} cols={6} />
        </div>
      </AdminLayout>
    );
  }

  // Error
  if (isError) {
    return (
      <AdminLayout>
        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center text-red-500">
          Gagal mengambil data. Pastikan backend menyala.
        </div>
      </AdminLayout>
    );
  }

  const totalPages = data?.total ? Math.ceil(data.total / limit) : 1;

  return (
    <AdminLayout>
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <TableHeaderControls
          onSearch={(v: string) => setSearchInput(v)}
        />

        <div className="mt-6">
          <TeachersTable
            data={filteredTeachers}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalData={data?.total || filteredTeachers.length}
            limit={limit}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
