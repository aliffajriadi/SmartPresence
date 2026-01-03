'use client';

import { useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { LaporanFormData } from '@/types/laporan';

interface LaporanGeneratorFormProps {
  onGenerate: (formData: LaporanFormData) => void;
  isLoading?: boolean;
}

const periodeOptions = ['Harian', 'Mingguan', 'Bulanan'];
const kelasOptions = [
  'Semua Kelas',
  'X IPA 1',
  'X IPA 2',
  'X IPS 1',
  'X IPS 2',
  'XI IPA 1',
  'XI IPA 2',
  'XI IPS 1',
  'XI IPS 2',
  'XII IPA 1',
  'XII IPA 2',
  'XII IPS 1',
  'XII IPS 2',
];

export default function LaporanGeneratorForm({ onGenerate, isLoading }: LaporanGeneratorFormProps) {
  const [formData, setFormData] = useState<LaporanFormData>({
    periode: 'Harian',
    tanggal: '',
    kelas: 'Semua Kelas',
    siswa: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <FileText size={24} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Buat Laporan Baru</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Pilih Periode */}
          <div>
            <label htmlFor="periode" className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Periode:
            </label>
            <select
              id="periode"
              name="periode"
              value={formData.periode}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {periodeOptions.map((periode) => (
                <option key={periode} value={periode}>
                  {periode}
                </option>
              ))}
            </select>
          </div>

          {/* Tanggal */}
          <div>
            <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal:
            </label>
            <input
              type="date"
              id="tanggal"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Pilih Kelas */}
          <div>
            <label htmlFor="kelas" className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Kelas:
            </label>
            <select
              id="kelas"
              name="kelas"
              value={formData.kelas}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {kelasOptions.map((kelas) => (
                <option key={kelas} value={kelas}>
                  {kelas}
                </option>
              ))}
            </select>
          </div>

          {/* Pilih Siswa (Opsional) */}
          <div>
            <label htmlFor="siswa" className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Siswa (Opsional):
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                id="siswa"
                name="siswa"
                value={formData.siswa}
                onChange={handleChange}
                placeholder="Cari nama siswa (opsional)....."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-md hover:opacity-90 transition-all ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
            }`}
          >
            {isLoading ? 'Memproses...' : 'Generate Laporan'}
          </button>
        </div>
      </form>
    </div>
  );
}