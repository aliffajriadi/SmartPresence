"use client"

import { ReactNode, useEffect } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SideModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  side?: "left" | "right"
  width?: string
}

export function SideModal({
  isOpen,
  onClose,
  title,
  children,
  side = "right",
  width = "w-[400px]",
}: SideModalProps) {

  // Tutup modal dengan tombol ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* BACKDROP */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* DRAWER / MODAL SLIDE */}
          <motion.div
            initial={{ x: side === "right" ? 500 : -500 }}
            animate={{ x: 0 }}
            exit={{ x: side === "right" ? 500 : -500 }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className={`absolute top-0 ${side}-0 h-full bg-white shadow-2xl ${width} p-6 rounded-l-2xl flex flex-col`}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-md transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="h-px bg-gray-200 mb-4" />

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto text-gray-700">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
