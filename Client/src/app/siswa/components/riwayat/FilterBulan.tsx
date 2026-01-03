"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface Props {
  onFilter: (bulan: number) => void;
}

export default function FilterBulan({ onFilter }: Props) {
  const [bulan, setBulan] = useState<number>(1); // default "Hari ini"

  const bulanList: { [key: number]: string } = {
    6: "Hari ini",
    1: "Minggu Ini",
    2: "1 Bulan Lalu",
    3: "3 Bulan Lalu",
    4: "6 Bulan Lalu",
    5: "1 Tahun Lalu",
  };

  const handleClick = () => {
    onFilter(bulan);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label htmlFor="bulan" className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Periode:
          </label>
          <select
            id="bulan"
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            value={bulan}
            onChange={(e) => setBulan(parseInt(e.target.value))}
          >
            {Object.entries(bulanList).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleClick}
            className="flex items-center gap-2 bg-primary hover:opacity-90 text-white font-semibold rounded-lg px-6 py-2.5 shadow-md transition duration-200"
          >
            <Search className="w-5 h-5" />
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}
