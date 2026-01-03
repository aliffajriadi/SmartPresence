"use client";

import { Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeleteUser } from "@/lib/hooks/useUser";
import { useState } from "react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import { Siswa } from "@/types/Siswa";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { toast } from "sonner";
import Image from "next/image";

interface TableSiswaProps {
  data: Siswa[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalData: number;
  limit: number;
}

export default function TableSiswa({
  data,
  page,
  totalPages,
  onPageChange,
  totalData,
  limit,
}: TableSiswaProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const deleteUserMutation = useDeleteUser();

  const handleConfirmDelete = (id: number) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleDelete = () => {
    if (!selectedId) return;

    deleteUserMutation.mutate(selectedId, {
      onSuccess: () => {
        setShowModal(false);
        setSelectedId(null);
        toast.success("Data siswa berhasil dihapus");

        // jika halaman kosong setelah hapus, mundur 1 halaman
        if (data.length === 1 && page > 1) {
          onPageChange(page - 1);
        } else {
          onPageChange(page); // refresh halaman sekarang
        }
      },
      onError: (err: unknown) => {
        const msg = getErrorMessage(err);
        toast.error("Gagal menghapus siswa", { description: msg });
      },
    });
  };
  function FotoSiswa({ photo, name }: { photo?: string; name?: string }) {
  const [isLoading, setIsLoading] = useState(true);

  const finalName = name ?? "Unknown";
  const finalPhoto = photo ?? "default";

  const src =
    finalPhoto === "default"
      ? "/default.jpeg"
      : `https://jokilek.diskon.com/storage/files/${finalPhoto}`;

  return (
    <div className="relative w-[50px] h-[50px] overflow-hidden rounded-full">
      {isLoading && (
        <div className="absolute inset-0 rounded-full bg-gray-200 animate-pulse" />
      )}
      <Image
        src={src}
        alt={finalName}
        width={50}
        height={50}
        className={`rounded-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
}


  const handleEdit = (id: number) =>
    router.push(`/admin/data-siswa/${id}/edit`);

  if (!data || data.length === 0)
    return (
      <div className="text-center py-12 text-gray-500">
        Tidak ada data siswa
      </div>
    );

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + data.length;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-xl shadow-sm min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Foto Siswa
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                NISN
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Nama Siswa
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Kontak Orang Tua
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                UID RFID
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((siswa: Siswa) => (
              <tr
                key={siswa.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4 font-mono text-sm overflow-hidden text-gray-600">
                  <FotoSiswa photo={siswa.photo} name={siswa.name} />
                </td>
                <td className="py-4 px-4 font-mono text-sm text-gray-600">
                  {siswa.nisn ?? "-"}
                </td>
                <td className="py-4 px-4 font-medium text-gray-800">
                  {siswa.name}
                </td>
                <td className="py-4 px-4 text-gray-600">{siswa.nohp}</td>
                <td className="py-4 px-4 font-mono text-sm text-gray-600">
                  {siswa.rfid?.rfid || "-"}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(Number(siswa.id))}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleConfirmDelete(Number(siswa.id))}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
        <p className="text-sm text-gray-500">
          Menampilkan{" "}
          <span className="font-medium text-gray-900">{startIndex + 1}</span>{" "}
          sampai <span className="font-medium text-gray-900">{endIndex}</span>{" "}
          dari <span className="font-medium text-gray-900">{totalData}</span>{" "}
          data
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === p
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal Konfirmasi */}
      <ConfirmDeleteModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Hapus Data Siswa"
        message="Apakah kamu yakin ingin menghapus data siswa ini? Tindakan ini tidak dapat dibatalkan."
      />
    </>
  );
}
