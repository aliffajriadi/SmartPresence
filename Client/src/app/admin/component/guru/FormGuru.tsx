'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, User, RefreshCw, XCircle } from 'lucide-react';
import { Teacher, TeacherFormData, FormErrors } from '@/types/Guru';
import { useCreateUser, useUpdateUser } from '@/lib/hooks/useUser';
import { toast } from "sonner";
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { io, Socket } from 'socket.io-client';

interface TeacherFormProps {  
  mode: 'add' | 'edit';
  initialData?: Teacher;
}

export default function TeacherForm({ mode, initialData }: TeacherFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: mutateCreate, isPending: isCreating } = useCreateUser();
  const { mutateAsync: mutateUpdate, isPending: isUpdating } = useUpdateUser();
  const isSubmitting = isCreating || isUpdating;

  const [formData, setFormData] = useState<TeacherFormData>({
    id: '',
    nama: '',
    nip: '',
    nohp: '',
    rfidCode: '',
    role: 'guru',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isModalScanOpen, setIsModalScanOpen] = useState(false);
  const [scannedRfid, setScannedRfid] = useState<string | null>(null);
  const [socketStatus, setSocketStatus] = useState<"connected" | "disconnected" | "error">("disconnected");
  const [socket, setSocket] = useState<Socket | null>(null);

  // Load data saat edit
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        id: initialData.id?.toString() ?? "",
        nama: initialData.nama ?? "",
        nip: initialData.nip ?? "",
        nohp: initialData.nohp ?? "",
        rfidCode: initialData.rfid?.rfid ?? "",
        role: initialData.role as 'guru' | 'admin' | 'siswa',
      });
    }
  }, [mode, initialData]);
  // Socket.IO Connection
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL || "";
    const socketInstance = io(url, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket.IO connected:", socketInstance.id);
      setSocketStatus("connected");
      socketInstance.emit("rfid:tap", "scan");
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected:", reason);
      setSocketStatus("disconnected");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
      setSocketStatus("error");
    });

    socketInstance.on("rfid:tap", (uid: string) => {
      console.log("RFID terbaca:", uid);
      setScannedRfid(uid);
      toast.success(`RFID terdeteksi: ${uid}`);
    });

    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.off("connect_error");
      socketInstance.off("rfid:tap");
      socketInstance.disconnect();
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nip.trim()) {
      newErrors.id = 'NIP Guru harus diisi';
    }
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama lengkap harus diisi';
    }
    if (!formData.nohp.trim()) {
      newErrors.nohp = 'Nomor telepon harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const basePayload = {
      name: formData.nama,
      role: formData.role,
      nip: formData.nip,
      rfidCode: formData.rfidCode,
      nohp: formData.nohp,
    };

    try {
      if (mode === 'add') {
        await mutateCreate({
          ...basePayload,
          password: "guru123",
        });
        toast.success("Data guru berhasil dibuat!");
      } else if (mode === 'edit' && initialData?.id) {
        await mutateUpdate({ 
          id: Number(initialData.id),
          data: basePayload
        });
        toast.success("Data guru berhasil diperbarui!");
      }

      queryClient.invalidateQueries({ queryKey: ['userParams'] });
      router.push("/admin/data-guru");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Gagal menyimpan data guru");
    }
  };

  const handleCancel = () => {
    router.push('/admin/data-guru');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const getPhotoUrl = () => {
    if (!initialData?.photo || initialData.photo === "default") {
      return "/default.jpeg";
    }
    return `https://jokilek.diskon.com/storage/files/${initialData.photo}`;
  };

  const handleSaveRfid = () => {
    if (scannedRfid) {
      setFormData((prev) => ({ ...prev, rfidCode: scannedRfid }));
      toast.success("UID RFID berhasil disimpan!");
      setIsModalScanOpen(false);
      setScannedRfid(null);
    } else {
      toast.error("Belum ada UID yang terdeteksi!");
    }
  };

  const handleCloseScanModal = () => {
    setIsModalScanOpen(false);
    setScannedRfid(null);
  };

  const handleOpenScanModal = () => {
    setIsModalScanOpen(true);
    setScannedRfid(null);
    
    if (socket?.connected) {
      socket.emit("rfid:join", "scan");
    }
  };

  const modalScan = () => {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header Modal */}
          <div className="bg-primary p-6 text-white text-center relative">
            <div className="absolute right-4 top-4">
              <button
                onClick={handleCloseScanModal}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <RefreshCw
                className={`w-8 h-8 ${
                  socketStatus === "connected" && !scannedRfid
                    ? "animate-spin"
                    : ""
                }`}
              />
            </div>
            <h2 className="text-xl font-bold">Scan Kartu RFID</h2>
            <p className="text-primary-foreground/80 text-sm">
              Silakan tempelkan kartu pada alat reader
            </p>
          </div>

          {/* Body Modal */}
          <div className="p-8 text-center">
            {/* Status Connection */}
            <div className="mb-4">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  socketStatus === "connected"
                    ? "bg-green-100 text-green-700"
                    : socketStatus === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    socketStatus === "connected"
                      ? "bg-green-500 animate-pulse"
                      : socketStatus === "error"
                      ? "bg-red-500"
                      : "bg-gray-500"
                  }`}
                />
                {socketStatus === "connected"
                  ? "Terhubung"
                  : socketStatus === "error"
                  ? "Error"
                  : "Terputus"}
              </div>
            </div>

            {/* Ilustrasi Scan */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              {socketStatus === "connected" && !scannedRfid && (
                <div className="absolute inset-0 bg-primary/10 rounded-xl animate-ping" />
              )}
              <div className="relative bg-gray-50 border-2 border-dashed border-primary/30 rounded-xl h-full flex flex-col items-center justify-center">
                <div className="text-primary mb-1">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M12 9v6" />
                    <path d="M9 12h6" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono text-gray-400">
                  {scannedRfid ? "SCANNED" : "READY TO SCAN"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border transition-all ${
                  scannedRfid
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                  UID Terdeteksi
                </p>
                <p
                  className={`text-lg font-mono font-bold tracking-widest ${
                    scannedRfid ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {scannedRfid ?? "MENUNGGU..."}
                </p>
              </div>

              <p className="text-sm text-gray-500">
                {socketStatus !== "connected"
                  ? "Menghubungkan ke server..."
                  : "Pastikan ID yang muncul sudah sesuai sebelum menekan tombol simpan."}
              </p>
            </div>
          </div>

          {/* Footer Modal */}
          <div className="p-6 bg-gray-50 flex gap-3">
            <button
              onClick={handleCloseScanModal}
              className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all active:scale-95"
            >
              Batal
            </button>
            <button
              onClick={handleSaveRfid}
              disabled={!scannedRfid}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Simpan UID
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {isModalScanOpen && modalScan()}

      {/* Section Foto Profil */}
      {mode === 'edit' && initialData && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Foto Profil Guru
          </h3>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
              <Image
                src={getPhotoUrl()}
                alt={`Foto ${initialData.nama || "Guru"}`}
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">
                Foto profil guru saat ini
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <User className="w-4 h-4" />
                <span>{initialData.nama || "Nama belum diisi"}</span>
              </div>
              <div className="text-sm text-gray-400">
                NIP: {initialData.nip || "-"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Data Guru */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-6">
          {mode === 'add' ? 'Tambah Data Guru' : 'Edit Data Guru'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* NIP Guru */}
            <div>
              <label htmlFor="nip" className="block text-sm font-semibold text-gray-700 mb-2">
                NIP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nip"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                disabled={mode === 'edit'}
                placeholder="Contoh: 1234567890, 0987654321"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  mode === 'edit' ? 'bg-gray-50 cursor-not-allowed' : ''
                } ${
                  errors.id
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
              {errors.id && <p className="text-red-500 text-sm mt-1">{errors.id}</p>}
            </div>

            {/* Nama Lengkap */}
            <div>
              <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Contoh: Dr. Budi Santoso"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.nama
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
              {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
            </div>

            {/* Nomor Telepon */}
            <div>
              <label htmlFor="nohp" className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="nohp"
                name="nohp"
                value={formData.nohp}
                onChange={handleChange}
                placeholder="081234567890"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.nohp
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
              {errors.nohp && <p className="text-red-500 text-sm mt-1">{errors.nohp}</p>}
            </div>

            {/* RFID */}
            <div>
              <label htmlFor="rfidCode" className="block text-sm font-semibold text-gray-700 mb-2">
                UID RFID <span className="text-red-500">*</span>{" "}
                <button
                  type="button"
                  onClick={handleOpenScanModal}
                  className="text-primary text-xs border-b border-primary hover:text-primary/80 hover:border-primary/80 transition-colors ml-2"
                >
                  Scan Kartu
                </button>
              </label>
              <input
                type="text"
                id="rfidCode"
                name="rfidCode"
                value={formData.rfidCode}
                onChange={handleChange}
                placeholder="Scan Kartu / Masukkan Kode RFID"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.rfidCode
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
              {errors.rfidCode && <p className="text-red-500 text-sm mt-1">{errors.rfidCode}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:opacity-90 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>
                {isSubmitting
                  ? mode === 'edit'
                    ? 'Memperbarui...'
                    : 'Menyimpan...'
                  : mode === 'edit'
                  ? 'Perbarui Data Guru'
                  : 'Simpan Data Guru'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
              <span>Batal</span>
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center">
            <span className="text-red-500">*</span> Wajib diisi
          </p>
        </form>
      </div>
    </div>
  );
}