import { ChangeEvent } from "react";

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

interface FormData {
  loginAs: "SISWA" | "GURU" | "ADMIN";
  nisn: string;
  username: string;
  password: string;
}

interface LoginPayload {
  role: string;
  identifier?: string;
  name?: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    role: string;
    name: string;
    nisn?: string | null;
    nip?: string | null;
  };
}


export type { InputFieldProps, SelectFieldProps, FormData, LoginPayload,LoginResponse };
