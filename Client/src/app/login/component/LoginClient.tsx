"use client";

import LoginForm from "./FormLogin";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function LoginClient() {
  const params = useSearchParams();
  const error = params.get("error");

  useEffect(() => {
    if (!error) return;
    setTimeout(() => {
      if (error === "unauthorized") toast.error("Anda tidak memiliki akses");
      if (error === "unauth") toast.error("Anda belum login");
    }, 50);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12">
        <LoginForm />
      </div>

      <footer className="text-center pb-8">
        <p className="text-[#2F4C87] font-semibold text-lg">
          Smart System for School Attendance Needs.
        </p>
      </footer>
    </div>
  );
}
