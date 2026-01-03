"use client";
import { useEffect, useRef } from "react";

const Loading = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null); // beri type

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 3; // 3x lebih cepat
    }
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/30 z-[9999]">
      <video
        ref={videoRef}
        src="/loading.webm"
        autoPlay
        loop
        muted
        playsInline
        className="w-40"
      ></video>

      <p className="text-primary font-semibold">Loading....</p>
    </div>
  );
};

export default Loading;
