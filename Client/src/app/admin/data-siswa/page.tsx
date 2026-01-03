"use client";

import { useState, useEffect, useRef } from "react";
import AdminLayout from "../component/layout/Layout";
import SiswaTable from "../component/siswa/TableSiswa";
import TableHeaderControls from "../component/siswa/TableHeaderControls";
import { useUserQuery, useSearchUser } from "@/lib/hooks/useUser";
import SkeletonTable from "@/components/SkeletonTable";

export default function SiswaPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;
  const role = "siswa";

  // 🔥 untuk mencegah pagination direset ketika klik pagination
  const isFromPagination = useRef(false);

  const handlePageChange = (p: number) => {
    isFromPagination.current = true;
    setPage(p);
  };

  // 🕒 Debounce 1 detik untuk searchInput → search
  useEffect(() => {
    const timer = setTimeout(() => {
      // jika bukan dari pagination → reset ke page 1
      if (!isFromPagination.current) {
        setPage(1);
      }

      setSearch(searchInput);

      // reset flag
      isFromPagination.current = false;
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const isSearching = search.trim().length > 0;

  // Normal query
  const userQuery = useUserQuery(page.toString(), limit.toString(), role);

  // Search query
  const searchQueryApi = useSearchUser(
    page.toString(),
    limit.toString(),
    search,
    role
  );

  // pilih query aktif
  const active = isSearching ? searchQueryApi : userQuery;

  const totalPages = active.data?.total
    ? Math.ceil(active.data.total / limit)
    : 1;

  // Loading
  if (active.isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 bg-white rounded-2xl border">
          <TableHeaderControls
            title="Data Siswa"
            addButtonLink="/admin/data-siswa/add"
            addButtonLabel="Tambah Siswa"
            onSearch={(v) => setSearchInput(v)}
          />
          <SkeletonTable rows={10} cols={6} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 bg-white rounded-2xl border">
        <TableHeaderControls
          title="Data Siswa"
          addButtonLink="/admin/data-siswa/add"
          addButtonLabel="Tambah Siswa"
          onSearch={(v) => setSearchInput(v)}
        />

        <div className="mt-6">
          <SiswaTable
            data={active.data?.users || []}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalData={active.data?.total || 0}
            limit={limit}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
