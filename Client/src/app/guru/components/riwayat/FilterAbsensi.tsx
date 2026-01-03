"use client";

import { Search, CalendarDays } from "lucide-react";

interface FilterAbsensiProps {
  kelas: string;
  setKelas: (kelas: string) => void;
  nama: string;
  setNama: (nama: string) => void;
  tanggal: string;
  setTanggal: (tanggal: string) => void;
  onFilter: () => void;
}

/**
 * Komponen filter absensi untuk guru
 */
export default function FilterAbsensi({
  kelas,
  setKelas,
  nama,
  setNama,
  tanggal,
  setTanggal,
  onFilter,
}: FilterAbsensiProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

        {/* Pilih Kelas */}
        <div className="col-span-1">
          <label htmlFor="kelas" className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Kelas:
          </label>
          <div className="relative">
            <select
              id="kelas"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white cursor-pointer"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
            >
              <option value="">Semua Kelas</option>
              <option value="XII A">XII A</option>
              <option value="X IPA 1">X IPA 1</option>
              <option value="X IPS 2">X IPS 2</option>
            </select>
            <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Cari Siswa */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
            Cari Siswa:
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="nama"
              type="text"
              placeholder="Ketik nama siswa..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </div>
        </div>

        {/* Pilih Tanggal */}
        <div className="col-span-1">
          <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal:
          </label>
          <div className="relative">
            <input
              id="tanggal"
              type="date"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tombol Terapkan Filter */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onFilter}
          className="flex items-center gap-2 bg-primary hover:opacity-90 text-white font-semibold rounded-lg px-6 py-2.5 shadow-md transition duration-200"
        >
          <Search className="w-5 h-5" />
          Terapkan Filter
        </button>
      </div>
    </div>
  );
}
