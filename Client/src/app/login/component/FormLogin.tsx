"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import Image from "next/image";
import {
  InputFieldProps,
  SelectFieldProps,
  FormData,
  LoginPayload,
} from "@/types/login";
import { useLogin } from "@/lib/hooks/useLogin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// ============================================
// INPUT FIELD COMPONENT
// ============================================
const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  showPasswordToggle = false,
  onTogglePassword,
  showPassword,
}) => {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          type={
            showPasswordToggle ? (showPassword ? "text" : "password") : type
          }
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// SELECT/DROPDOWN COMPONENT
// ============================================
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
// LOGIN FORM COMPONENT
// ============================================
const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    loginAs: "SISWA",
    nisn: "",
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const mutation = useLogin(router);

  const loginOptions = [
    { value: "SISWA", label: "SISWA", loginWith: "NOMOR INDUK SISWA" },
    { value: "GURU", label: "GURU", loginWith: "NOMOR INDUK PEGAWAI" },
    { value: "ADMIN", label: "ADMIN", loginWith: "USERNAME" },
  ];

  const handleInputChange =
    (field: keyof FormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  // ==================================================
  // FIX TYPESCRIPT — Tanpa merubah logika apapun
  // ==================================================
  type ExtendedPayload = Partial<LoginPayload> & {
    nisn?: string;
    nip?: string;
    name?: string;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const payload: ExtendedPayload = {
      role: formData.loginAs.toLowerCase(),
      password: formData.password,
    };

    if (formData.loginAs === "SISWA") {
      payload.nisn = formData.nisn;
    } else if (formData.loginAs === "GURU") {
      payload.nip = formData.nisn;
    } else if (formData.loginAs === "ADMIN") {
      payload.name = formData.nisn;
    }
    mutation.mutate(payload as LoginPayload);
  };

  const isFormEmpty = !formData.nisn || !formData.password;

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="bg-white rounded-3xl shadow-2xl justify-center items-center flex flex-col p-8 md:p-10">
        <Image
          src="/LOGO.png"
          alt="Logo SmartPresence"
          width={250}
          height={250}
          className="mb-4"
          priority
        />

        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-medium text-[#2F4C87] mb-2">
            Masuk ke Dashboard
          </h2>
          <p className="text-sm text-gray-500">
            Monitoring Absensi Siswa dan Guru
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <SelectField
            label="LOGIN SEBAGAI"
            value={formData.loginAs}
            onChange={handleInputChange("loginAs")}
            options={loginOptions}
          />

          <InputField
            label={
              formData.loginAs === "SISWA"
                ? "NOMOR INDUK SISWA"
                : formData.loginAs === "GURU"
                ? "NOMOR INDUK PEGAWAI"
                : "USERNAME"
            }
            type="text"
            placeholder={
              formData.loginAs === "SISWA"
                ? "Masukkan NISN Anda"
                : formData.loginAs === "GURU"
                ? "Masukkan NIP Anda"
                : "Masukkan Username Anda"
            }
            value={formData.nisn}
            onChange={handleInputChange("nisn")}
          />

          <InputField
            label="Password"
            placeholder="Masukkan password Anda"
            value={formData.password}
            onChange={handleInputChange("password")}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <div className="text-right mt-6">
            <Button asChild variant="link">
              <Link href="/lupa-password">Lupa Password?</Link>
            </Button>
          </div>

          <button
            type="submit"
            disabled={isFormEmpty || mutation.status === "pending"}
            className={`w-full bg-[#2F4C87] text-white py-3.5 rounded-lg font-semibold text-lg transform transition-all duration-200 shadow-md hover:shadow-xl 
              ${
                isFormEmpty || mutation.status === "pending"
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#253a6a] hover:-translate-y-0.5"
              }
            `}
          >
            {mutation.status === "pending" ? "Loading..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
