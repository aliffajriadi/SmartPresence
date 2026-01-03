'use client';

import { Download, FileText } from 'lucide-react';
import { DetailAbsensi } from '@/types/laporan';

interface LaporanDetailTableProps {
  details: DetailAbsensi[];
  onExportPDF: () => void;
}

export default function LaporanDetailTable({ details, onExportPDF }: LaporanDetailTableProps) {
  if (details.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FileText size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum Ada Laporan</h3>
          <p className="text-gray-600">
            Silakan generate laporan terlebih dahulu dengan mengisi form di atas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header dengan tombol Export */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Detail Laporan</h3>
        <button
          onClick={onExportPDF}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <Download size={18} />
          Ekspor PDF
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">NIS</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama Siswa</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Jumlah Hadir</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Jumlah Terlambat</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Jumlah Alfa</th>
            </tr>
          </thead>
          <tbody>
            {details.map((detail, index) => (
              <tr 
                key={detail.nis} 
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}
              >
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">{detail.nis}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{detail.namaSiswa}</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center min-w-[40px] px-2.5 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-700">
                    {detail.jumlahHadir}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center min-w-[40px] px-2.5 py-1 rounded-full text-sm font-semibold bg-yellow-50 text-yellow-700">
                    {detail.jumlahTerlambat}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center min-w-[40px] px-2.5 py-1 rounded-full text-sm font-semibold bg-red-50 text-red-700">
                    {detail.jumlahAlfa}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with total count */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Menampilkan <span className="font-semibold text-gray-800">{details.length}</span> siswa
        </p>
      </div>
    </div>
  );
}