"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, LogOut } from "lucide-react";
import { useLogout } from "@/lib/hooks/useLogout";
import { useCurrentUser } from "@/lib/hooks/useUser";
import Image from "next/image";

interface NavbarProps {
  onMenuClick: () => void;
  role?: string;
}

// Komponen Clock client-only
function Clock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // set waktu awal
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <h1 className="text-sm text-gray-600 hidden lg:flex flex-col gap-1">
      <span className="font-medium">20.22.17</span>
      <span>15 Desember 2025</span>
    </h1>; // jangan render sebelum mount

  const formattedTime = time.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = time.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <h1 className="text-sm text-gray-600 hidden lg:flex flex-col gap-1">
      <span className="font-medium">{formattedTime}</span>
      <span>{formattedDate}</span>
    </h1>
  );
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: user, isLoading } = useCurrentUser();
  const logoutMutation = useLogout();

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Tombol menu untuk mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        {/* Jam & tanggal */}
        <Clock />

        {/* Dropdown user */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center cursor-pointer hover:scale-105 hover:underline ${dropdownOpen ? "scale-105 underline" : ""} transition-all gap-3 focus:outline-none`}
          >
            <span className="text-sm font-medium text-gray-700 capitalize">
              {isLoading ? "Memuat..." : user?.name || "Pengguna"}
            </span>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-primary hover:border-2 hover:border-primary transition-all duration-150">
              <Image
                src={
                  user?.photo === "default"
                    ? "/default.jpeg"
                    : `https://jokilek.diskon.com/storage/files/${user?.photo}`
                }
                alt={user?.name || "Pengguna"}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 shadow-xl rounded-xl z-40 p-2 animate-fadeIn">
              <button
                onClick={() => logoutMutation.mutate()}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 transition-all duration-150 hover:text-red-600"
              >
                <LogOut className="w-4 h-4 text-red-500/70" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
