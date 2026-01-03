'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Users,
  GraduationCap,
  Calendar,
  Settings,
  X,
  LayoutDashboard,
} from 'lucide-react'

interface SidebarProps {
  role: 'admin' | 'guru' | 'siswa'
  isOpen: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ role, isOpen, onClose }) => {
  const pathname = usePathname()

  // Menu berdasarkan role
  const menus: Record<string, { label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; href: string }[]> = { 
    admin: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
      { label: 'Data Guru', icon: GraduationCap, href: '/admin/data-guru' },
      { label: 'Data Siswa', icon: Users, href: '/admin/data-siswa' },
      { label: 'Laporan Absensi', icon: Calendar, href: '/admin/laporan' },
      { label: 'Pengaturan', icon: Settings, href: '/admin/pengaturan' },
    ],
    guru: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/guru' },
      { label: 'Riwayat Absensi', icon: Calendar, href: '/guru/riwayat' },
      { label: 'Pengaturan', icon: Settings, href: '/guru/pengaturan' },
    ],
    siswa: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/siswa' },
      { label: 'Riwayat Absensi', icon: Calendar, href: '/siswa/riwayat' },
      { label: 'Pengaturan', icon: Settings, href: '/siswa/pengaturan' },
    ],
  }

  const menuItems = menus[role] || []

  return (
    <>
      {/* Overlay untuk mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-transform duration-300
          w-72 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header Sidebar */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Image src="/LOGO.png" alt="SmartPresence Logo" width={200} height={200} />
          <button onClick={onClose} className="lg:hidden">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Konten Sidebar */}
        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <LayoutDashboard className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-bold text-primary capitalize">{role}</h2>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              // Cek apakah ini adalah link dashboard utama (misal: /admin, /guru, atau /siswa)
              // Kita asumsikan dashboard link-nya sama persis dengan `/${role}`
              const isMainDashboard = item.href === `/${role}`

              let isActive = false

              if (isMainDashboard) {
                // KHUSUS DASHBOARD: Harus sama persis
                isActive = pathname === item.href
              } else {
                // MENU LAIN: Boleh sama persis ATAU punya anak path (sub-halaman)
                isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-primary font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
