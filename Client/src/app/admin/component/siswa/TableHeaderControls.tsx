'use client';

import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import Link from 'next/link'; // Pakai Link untuk navigasi lebih cepat

interface TableHeaderControlsProps {
  onSearch: (query: string) => void;
  title?: string;
  addButtonLink?: string;
  addButtonLabel?: string;
}

export default function TableHeaderControls({ 
  onSearch, 
  title = "Data Siswa", 
  addButtonLink = "/admin/data-siswa/add", 
  addButtonLabel = "Tambah Siswa" 
}: TableHeaderControlsProps) {
  
  const [searchQuery, setSearchQuery] = useState('');

  // Kirim query ke parent saat ngetik
  useEffect(() => {
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {/* Search Bar (Sama persis dengan Guru) */}
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Cari ${title}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-80 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Tombol Tambah (Warna & Style disamakan dengan Guru) */}
        <Link
          href={addButtonLink}
          className="bg-primary hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>{addButtonLabel}</span>
        </Link>
      </div>
    </div>
  );
}