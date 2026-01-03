'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Save, AlertCircle, CheckCircle } from "lucide-react";
import { useUpdatePasswordProfile } from "@/lib/hooks/useUser";
import { UserUpdatePassword } from "@/types/user";
import { AxiosError } from "axios";

// Notifikasi
const Notification = ({ type, text }: { type: "success" | "error"; text: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex items-center p-3 rounded-xl text-sm mb-6 ${
      type === "success"
        ? "bg-green-50 text-green-700 border-l-4 border-green-500"
        : "bg-red-50 text-red-700 border-l-4 border-red-500"
    }`}
  >
    {type === "success" ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
    <p className="flex-grow">{text}</p>
  </motion.div>
);

// Input Password
const PasswordInput = ({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type="password"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-xl p-3.5 text-base focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm"
      required
    />
  </div>
);

export default function UbahPasswordAdmin() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<null | { type: "success" | "error"; text: string }>(null);

  const updatePassword = useUpdatePasswordProfile();

  useEffect(() => {
    if (newPassword && newPassword.length < 6) setMessage({ type: "error", text: "Password baru minimal 6 karakter." });
    else if (newPassword && confirmPassword && newPassword !== confirmPassword)
      setMessage({ type: "error", text: "Password baru dan konfirmasi tidak sama." });
    else setMessage(null);
  }, [newPassword, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6 || newPassword !== confirmPassword) return;

    const payload: UserUpdatePassword = {
      password: newPassword,
      confirm_password: currentPassword,
    };

    updatePassword.mutate(payload, {
        onSuccess: () => {
            setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
            setMessage({ type: "success", text: "Password berhasil diubah!" });
        },
        onError: (error: unknown) => {
            let errorMessage = "Gagal update password";
            if (error instanceof AxiosError) {
            errorMessage = error.response?.data?.message || errorMessage;
            }
            setMessage({ type: "error", text: errorMessage });
        },
        });
    };
  return (
    <div className="bg-white rounded-2xl p-6 md:p-10 shadow-2xl border border-gray-100 max-w-4xl mx-auto mt-6">
      {/* Header */}
      <div className="flex flex-col items-center border-b border-gray-200 pb-6 mb-8">
        <div className="p-3 rounded-full bg-primary-100 text-primary-600 mb-4"><Lock className="w-8 h-8" /></div>
        <h2 className="text-2xl font-bold text-gray-800">Ubah Password Admin</h2>
        <p className="text-gray-500 text-center mt-1 text-sm">Jaga keamanan akun Anda dengan mengganti password secara berkala.</p>
      </div>

      {message && <Notification type={message.type} text={message.text} />}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid: Horizontal untuk layar md+, vertical untuk mobile */}
        <div className="flex flex-col md:flex-row gap-4">
          <PasswordInput label="Password Lama" placeholder="Masukkan password lama" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} />
          <PasswordInput label="Password Baru" placeholder="Minimal 6 karakter" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <PasswordInput label="Konfirmasi Password Baru" placeholder="Ketik ulang password baru" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
        </div>

        <div className="flex justify-end pt-4">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-primary hover:opocity-90 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all"
          >
            <Save size={20}/> Simpan Perubahan
          </motion.button>
        </div>
      </form>
    </div>
  );
}
