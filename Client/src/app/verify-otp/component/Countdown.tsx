import React from "react";

interface CountdownProps {
  countdown: number;
  canResend: boolean;
  onResend: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ countdown, canResend, onResend }) => (
  <div className="text-center mb-6 mt-4">
    {!canResend ? (
      <p className="text-sm text-gray-500">
        Kirim ulang OTP dalam waktu{' '}
        <span className="font-bold text-[#2F4C87]">{countdown}</span> detik
      </p>
    ) : (
      <button
        onClick={onResend}
        className="text-sm text-[#2F4C87] hover:text-[#253a6a] font-semibold transition-colors underline"
      >
        Kirim ulang OTP
      </button>
    )}
  </div>
);
