"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Save } from "lucide-react";
import { useUpdatePasswordProfile } from "@/lib/hooks/useUser";
import { UserUpdatePassword } from "@/types/user";

export default function UbahPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<null | {
    type: "success" | "error";
    text: string;
  }>(null);
  const updatePassword = useUpdatePasswordProfile();
  // Realtime validation saat user mengetik
  useEffect(() => {
    if (newPassword && newPassword.length < 6) {
      setMessage({ type: "error", text: "Password baru minimal 6 karakter." });
    } else if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Password baru dan konfirmasi tidak sama." });
    } else {
      setMessage(null);
    }
  }, [newPassword, confirmPassword]);
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password baru minimal 6 karakter." });
      return;
    }
    const payload: UserUpdatePassword = {
      password: confirmPassword,
      confirm_password: currentPassword,
    };

    updatePassword.mutate(
      payload,
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (e: unknown) => {
          setMessage({ type: "error", text: "Gagal update password" });
          console.log(e);
        },
      }
    );

    setMessage({ type: "success", text: "Password berhasil diubah!" });

    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Password baru dan konfirmasi password tidak cocok.",
      });
      return;
    }
  };

  const Notification = ({
    type,
    text,
  }: {
    type: "success" | "error";
    text: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-lg text-sm mb-4 ${
        type === "success"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {text}
    </motion.div>
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 space-y-6">
      <div className="flex items-center gap-3 border-b pb-4 mb-2">
        <Lock className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-800">Ubah Password</h2>
      </div>

      {message && <Notification {...message} />}

      <form onSubmit={handlePasswordChange} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password Lama:
          </label>
          <input
            type="password"
            placeholder="Masukkan Password Anda saat ini"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password Baru:
          </label>
          <input
            type="password"
            placeholder="Masukkan password baru"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Konfirmasi Password Baru:
          </label>
          <input
            type="password"
            placeholder="Ketik ulang password baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="pt-4 flex justify-end">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-primary hover:opacity-90 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md transition-all"
          >
            <Save size={20} />
            Simpan Perubahan
          </motion.button>
        </div>
      </form>
    </div>
  );
}
