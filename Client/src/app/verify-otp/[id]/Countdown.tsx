"use client";
import React, { useState, useEffect } from "react";

interface CountdownProps {
  onResend: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ onResend }) => {
  const [seconds, setSeconds] = useState(180);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => setSeconds((v) => v - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [seconds]);

  const handleResendClick = () => {
    setSeconds(180);
    setCanResend(false);
    onResend();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="flex justify-between items-center mb-6 text-sm">
      <span className="text-gray-500">
        {seconds > 0 ? `Berlaku dalam ${formatTime(seconds)}` : "Kode kadaluwarsa"}
      </span>
      <button
        onClick={handleResendClick}
        disabled={!canResend}
        className={`${
          canResend ? "text-blue-600 font-bold" : "text-gray-400 cursor-not-allowed"
        }`}
      >
        Kirim Ulang
      </button>
    </div>
  );
};