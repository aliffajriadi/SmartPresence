"use client";
import { toast } from "sonner";
import Image from "next/image";
import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { MoveLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useResetPassword } from "@/lib/hooks/useResetPassword";
import { useRouter } from "next/navigation";

// ============================================
// TIPE PROPS UNTUK SELECT FIELD
// ============================================
interface SelectOption {
  value: string;
  label: string;
  loginWith: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
}

// ============================================
// SELECT/DROPDOWN COMPONENT
// ============================================
const loginOptions: SelectOption[] = [
  { value: "SISWA", label: "SISWA", loginWith: "NOMOR INDUK SISWA" },
  { value: "GURU", label: "GURU", loginWith: "NOMOR INDUK PEGAWAI" },
];

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer font-medium"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
};

// ============================================
// MAIN PAGE COMPONENT - LUPA PASSWORD
// ============================================
interface FormData {
  loginAs: string;
  nisn: string;
  phoneNumber: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const resetPasswordMutation = useResetPassword();
  const [formData, setFormData] = useState<FormData>({
    loginAs: "SISWA",
    nisn: "",
    phoneNumber: "",
  });

  const handleInputChange =
    (field: keyof FormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async () => {
    const { nisn, phoneNumber } = formData;

    if (!nisn || !phoneNumber) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    const phoneRegex = /^[0-9]{10,13}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Format nomor HP tidak valid. Masukkan 10-13 digit angka.");
      return;
    }

    resetPasswordMutation.mutate(
      {
        role: formData.loginAs.toLowerCase(),
        nohp: phoneNumber,
        ni: formData.nisn,
      },
      {
        onSuccess: (data) => {
          toast.success("Kode OTP telah dikirim ke WhatsApp Anda!");
          // Reset form
          setFormData({
            loginAs: "SISWA",
            nisn: "",
            phoneNumber: "",
          });
          // Kirim ID user ke halaman verifikasi via URL query
          router.push(`/verify-otp/${data.idUser}?9914f2055abc6279922c878baffc62c469796a3629ccd9adf1e61347a744b3a=${formData.phoneNumber}&1e61347a744b3a=${formData.nisn}&loginAs=${formData.loginAs}`);
        },
        onError: (data) => {
          toast.error(data?.message || "Gagal mengirim OTP");
        },
      }
    );
  };

  const isNullForm = !formData.nisn || !formData.phoneNumber || resetPasswordMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <Image
              src="/LOGO.png"
              alt="Logo"
              width={250}
              height={250}
              className="mx-auto mb-5"
            />

            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-medium text-[#2F4C87] mb-1">
                Lupa Password
              </h2>
              <p className="text-sm text-muted-foreground">
                Ganti Password Anda dengan kode OTP yang dikirim ke WhatsApp
              </p>
            </div>

            <div>
              {/* Select Field */}
              <SelectField
                label="SEBAGAI"
                value={formData.loginAs}
                onChange={handleInputChange("loginAs")}
                options={loginOptions}
              />

              {/* Input NISN/NIP */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  {formData.loginAs === "SISWA"
                    ? "NOMOR INDUK SISWA"
                    : "NOMOR INDUK PEGAWAI"}
                </label>
                <input
                  type="text"
                  value={formData.nisn}
                  onChange={handleInputChange("nisn")}
                  placeholder={
                    formData.loginAs === "SISWA"
                      ? "Masukkan NISN"
                      : "Masukkan NIP"
                  }
                  className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              {/* Input NO HP */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  NO HP
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange("phoneNumber")}
                  placeholder="Masukkan Nomor HP"
                  className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  Pastikan nomor Anda terdaftar, kami akan mengirimkan kode OTP
                  secara otomatis di WhatsApp Anda.
                </p>
              </div>

              {/* Button Kirim OTP */}
              <button
                disabled={isNullForm}
                onClick={handleSubmit}
                className={`w-full ${
                  isNullForm ? "opacity-50 cursor-not-allowed" : ""
                } bg-[#2F4C87] text-white py-3.5 rounded-lg font-semibold text-lg hover:bg-[#253a6a] transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-xl mt-2`}
              >
                {resetPasswordMutation.isPending ? "Loading..." : "Kirim OTP"}
              </button>

              <Button asChild variant="link" className="mt-4 mx-auto">
                <Link href="/login">
                  <MoveLeft className="mr-2" /> Kembali ke Login
                </Link>
              </Button>
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
