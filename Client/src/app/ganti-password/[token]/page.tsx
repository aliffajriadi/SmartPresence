"use client";
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useResetPasswordUpdate } from '@/lib/hooks/useResetPassword';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default function ResetPasswordPage({ params }: PageProps) {
  // Unwrapping params dari Next.js 15
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const router = useRouter();
  const updateMutation = useResetPasswordUpdate();

  // State untuk form password
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    // 1. Validasi Input Kosong
    if (!password || !confirmPassword) {
      toast.error('Mohon isi semua kolom password!');
      return;
    }

    // 2. Validasi Minimal Karakter
    if (password.length < 6) {
      toast.error('Password minimal terdiri dari 6 karakter!');
      return;
    }

    // 3. Validasi Kecocokan Password
    if (password !== confirmPassword) {
      toast.error('Konfirmasi password tidak cocok!');
      return;
    }

    // 4. Eksekusi Mutasi ke Server
    updateMutation.mutate(
      {
        reset_token: token,
        new_password: password,
      },
      {
        onSuccess: () => {
          toast.success("Password Anda berhasil diperbarui!");
          // Tunggu sebentar agar user bisa baca toast, lalu arahkan ke login
          setTimeout(() => {
            router.push('/login');
          }, 1500);
        },
        onError: (data) => {
          const errorMessage = data.message || "Gagal memperbarui password. Token mungkin kadaluwarsa.";
          toast.error(errorMessage as string);
        },
      }
    );
  };

  const isLoading = updateMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            
            {/* Logo */}
            <Image
              src="/LOGO.png"
              alt="Logo"
              width={250}
              height={250}
              className="mx-auto mb-5"
            />

            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-medium text-[#2F4C87] mb-2">
                Buat Password Baru
              </h2>
              <p className="text-sm text-muted-foreground">
                Masukkan password baru yang kuat untuk akun SmartPresence Anda.
              </p>
            </div>

            <div className="space-y-5">
              {/* Input Password Baru */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password baru"
                  className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              {/* Input Konfirmasi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                  className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              {/* Button Action */}
              <button
                disabled={isLoading}
                onClick={handleSubmit}
                className={`w-full flex items-center justify-center py-3.5 rounded-lg font-semibold text-lg text-white transition-all duration-200 shadow-md 
                  ${isLoading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-[#2F4C87] hover:bg-[#253a6a] transform hover:-translate-y-0.5 shadow-xl"}`}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Memproses...
                  </>
                ) : (
                  "Simpan Password Baru"
                )}
              </button>

              <div className="text-center mt-4">
                <Button asChild variant="link" className="text-gray-500">
                  <Link href="/login">
                    <MoveLeft className="mr-2 h-4 w-4" /> Kembali ke Login
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center pb-8">
        <p className="text-[#2F4C87] font-semibold text-lg">
          Smart System for School Attendance Needs.
        </p>
      </footer>
    </div>
  );
}