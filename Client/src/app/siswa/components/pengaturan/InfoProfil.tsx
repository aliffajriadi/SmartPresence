"use client";

import { User, Camera, Upload } from "lucide-react";
import { SiswaProfilInfoProps } from "@/types/user";
import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useUpdatePhoto, useUpdateProfile } from "@/lib/hooks/useUser";

export default function InfoProfil({
  name,
  nisn,
  nohp,
  rfid,
  notifikasi,
  photo,
}: SiswaProfilInfoProps) {
  const [waNotificationEnabled, setWaNotificationEnabled] =
    useState(notifikasi);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const updatePhoto = useUpdatePhoto();
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    updateProfile.mutate ({
      notif_aktif : !waNotificationEnabled
    }, { onSuccess: () => {
      toast.success(`Notifikasi di ${!waNotificationEnabled ? "aktif kan" : "non-aktif kan"}!`);
    }});
    setWaNotificationEnabled(!waNotificationEnabled);
  };

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar!");
      return;
    }

    // Validasi ukuran file (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 4MB!");
      return;
    }

    // Preview sementara (Optimistic UI)
    const url = URL.createObjectURL(file);
    setPreviewPhoto(url);
    
    // Set manual loading (opsional, bisa pakai status dari mutation)
    setIsUploading(true);

    // Persiapkan data
    const form = new FormData();
    form.append("photo", file);

    // --- BAGIAN YANG DIPERBAIKI ---
    // Langsung eksekusi mutasi di sini
    updatePhoto.mutate(form, {
      onSuccess: () => {
        // Reset state loading
        setIsUploading(false);
        // Toast sukses sudah di handle di hook useUpdatePhoto
      },
      onError: (error) => {
        console.error("Gagal upload:", error);
        // Kembalikan preview ke null jika gagal
        setPreviewPhoto(null);
        setIsUploading(false);
        // Toast error sudah di handle di hook useUpdatePhoto
      }
    });
  };

  const getUserPhoto = () => {
    if (previewPhoto) return previewPhoto;
    if (photo === "default") return "/default.jpeg";
    return `https://jokilek.diskon.com/storage/files/${photo}`;
  };

  const userPhoto = getUserPhoto();
  const isDefaultPhoto = photo === "default" && !previewPhoto;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 border-b pb-4 mb-6">
        <User className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-gray-800">Informasi Akun</h2>
      </div>

      {/* Alert jika foto default */}
      {isDefaultPhoto && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <Upload className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">
            Silakan upload foto profil terlebih dahulu!
          </p>
        </div>
      )}

      {/* Foto Profil */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
          <Image
            src={userPhoto}
            alt={`Foto ${name || "Profil"}`}
            fill
            className="object-cover"
            sizes="128px"
          />

          {/* Loading overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Tombol kamera */}
          <button
            onClick={handleOpenFile}
            disabled={isUploading}
            className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Ganti Foto"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
          disabled={isUploading}
        />

        <button
          onClick={handleOpenFile}
          disabled={isUploading}
          className="mt-4 px-4 py-2 text-sm text-primary font-semibold hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? "Mengupload..." : "Ganti Foto Profil"}
        </button>
      </div>

      {/* Informasi Akun */}
      <div className="space-y-4">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Lengkap
          </label>
          <div className="w-full border border-gray-200 rounded-lg p-3 text-sm font-semibold text-gray-800 bg-gray-50">
            {name || "-"}
          </div>
        </div>

        {/* NISN dan RFID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NISN
            </label>
            <div className="w-full border border-gray-200 rounded-lg p-3 text-sm font-semibold text-gray-800 bg-gray-50">
              {nisn || "-"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UID RFID
            </label>
            <div className="w-full border border-gray-200 rounded-lg p-3 text-sm font-mono font-semibold text-gray-800 bg-gray-50">
              {rfid || "-"}
            </div>
          </div>
        </div>

        {/* No. HP */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            No. HP Orang Tua
          </label>
          <div className="w-full border border-gray-200 rounded-lg p-3 text-sm font-semibold text-gray-800 bg-gray-50">
            {nohp || "-"}
          </div>
        </div>

        {/* Switch Notifikasi WhatsApp */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Notifikasi WhatsApp
            </label>
            <button
              onClick={handleToggle}
              role="switch"
              aria-checked={waNotificationEnabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                waNotificationEnabled ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                  waNotificationEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {waNotificationEnabled
              ? "Anda akan menerima notifikasi absensi melalui WhatsApp"
              : "Aktifkan untuk menerima notifikasi absensi"}
          </p>
        </div>
      </div>
    </div>
  );
}
