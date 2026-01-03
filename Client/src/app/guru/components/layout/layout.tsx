'use client'

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/layout'
import useCheckRequirement from '@/providers/requirement'

export default function GuruLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  useCheckRequirement()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar untuk guru */}
      <Sidebar role="guru" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Konten utama */}
      <div className="lg:ml-72">
        {/* Navbar */}
        <Navbar role="guru" onMenuClick={() => setSidebarOpen(true)} />

        {/* Isi halaman */}
        <main className="p-6 lg:p-8">
          
          {children}
        </main>
      </div>
    </div>
  )
}
