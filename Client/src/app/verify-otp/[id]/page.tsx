"use client";
import { use, useState, useEffect } from "react";
import { OtpInput } from "../component/Otp-Input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { toast } from "sonner";
import { Countdown } from "./Countdown";
import {
  useResetPasswordConfirm,
  useResetPassword,
} from "@/lib/hooks/useResetPassword";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}
export default function OtpVerificationPage({ params }: PageProps) {
  const searchParams = useSearchParams();
  const nomorHp = searchParams.get(
    "9914f2055abc6279922c878baffc62c469796a3629ccd9adf1e61347a744b3a"
  );
  const nomorInduk = searchParams.get("1e61347a744b3a");
  const loginAs = searchParams.get("loginAs");
  const resolvedParams = use(params);
  const id = Number(resolvedParams.id);
  const router = useRouter();

  const resetPasswordMutation = useResetPassword();
  const resetPasswordConfirmMutation = useResetPasswordConfirm();

  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [isNullForm, setIsNullForm] = useState(true);

  useEffect(() => {
    setIsNullForm(otp.some((digit) => digit === ""));
  }, [otp]);

  const handleSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      toast.error("Mohon lengkapi semua digit OTP!");
      return;
    }
    resetPasswordConfirmMutation.mutate(
      {
        id: id,
        otp: otpCode,
      },
      {
        onSuccess: (data) => {
          toast.success("Verifikasi berhasil!");
          router.push(`/ganti-password/${data}`);
        },
        onError: (data) => {
          toast.error(data.message || "Gagal verifikasi OTP");
        },
      }
    );
    setOtp(["", "", "", ""]);
  };

  const handleResendOtp = () => {
    resetPasswordMutation.mutate(
      {
        role: (loginAs || "").toLowerCase(),
        ni: nomorInduk || "",
        nohp: nomorHp || "",
      },
      {
        onSuccess: () => {
          toast.success("Kode OTP baru telah dikirim ke WhatsApp Anda!");
        },
        onError: (data) => {
          toast.error(data.message || "Gagal mengirim OTP");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <Image
              className="mx-auto mb-5"
              src="/LOGO.png"
              alt="Logo SmartPresence"
              width={250}
              height={250}
            />

            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-medium text-[#2F4C87] mb-2">
                Masukkan Kode OTP
              </h2>
            </div>

            <div>
              <div className="mb-4">
                <OtpInput otp={otp} setOtp={setOtp} />
              </div>

              <Countdown onResend={handleResendOtp} />

              <button
                disabled={isNullForm}
                onClick={handleSubmit}
                className={`w-full ${
                  isNullForm ? "opacity-50 cursor-not-allowed" : ""
                } bg-[#2F4C87] text-white py-3.5 rounded-lg font-semibold text-lg hover:bg-[#253a6a] transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-xl`}
              >
                Kirim OTP
              </button>

              <div className="text-center mt-6">
                <Button variant="link" asChild>
                  <Link href="/login">
                    <MoveLeft /> Kembali ke halaman login
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
