'use client'

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/layout'
interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar role="admin" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Konten utama */}
      <div className="lg:ml-72">
        {/* Navbar */}
        <Navbar role="admin" onMenuClick={() => setSidebarOpen(true)} />

        {/* Isi halaman */}
        <main className="p-6 lg:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 lg:hidden">Dashboard</h1>
          {children}
        </main>
      </div>
    </div>
  )
}
