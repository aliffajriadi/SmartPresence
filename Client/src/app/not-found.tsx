"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFoundError = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden px-4">
      {/* Background Animasi Blob */}
      <div className="absolute inset-0 overflow-hidden opacity-25">
        <div className="absolute top-16 left-8 w-56 h-56 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-32 right-8 w-56 h-56 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-16 left-1/2 w-56 h-56 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Konten Utama */}
      <div className="relative z-10 text-center max-w-xl w-full">
        {/* Angka 404 */}
        <div className="mb-4 sm:mb-8 animate-float">
          <h1 className="text-[6rem] sm:text-[10rem] md:text-[14rem] font-black leading-none">
            <span className="inline-block animate-bounce-slow text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              4
            </span>
            <span className="inline-block animate-spin-slow text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
              0
            </span>
            <span className="inline-block animate-bounce-slow animation-delay-300 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-blue-600 to-purple-600">
              4
            </span>
          </h1>
        </div>

        {/* Ikon Animasi */}
        <div className="mb-4 sm:mb-6 animate-fade-in-up animation-delay-300">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white rounded-full p-4 sm:p-6 shadow-2xl">
              <Search className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-wiggle" />
            </div>
          </div>
        </div>

        {/* Teks Deskripsi */}
        <div className="animate-fade-in-up animation-delay-500 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
            Ups! Halaman Tidak Ditemukan
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-1">
            Sepertinya halaman yang kamu cari menghilang entah ke mana...
          </p>
          <p className="text-sm sm:text-base text-gray-500">
            Jangan khawatir, bahkan penjelajah terbaik pun bisa tersesat! 🧭
          </p>
        </div>

        {/* Garis Hias */}
        <div className="flex items-center justify-center mb-6 sm:mb-8 animate-fade-in-up animation-delay-700">
          <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full"></div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up animation-delay-900">
          <Button
            className="group relative px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg font-semibold overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
            asChild
          >
            <Link href="/" className="flex items-center gap-2 justify-center">
              <Home className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" />
              <span>Kembali ke Beranda</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="group px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            asChild
          >
            <Link href="/" className="flex items-center gap-2 justify-center">
              <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Kembali</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* CSS Animasi */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -40px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(30px, 30px) scale(1.05);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-25px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-8deg);
          }
          75% {
            transform: rotate(8deg);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-900 { animation-delay: 900ms; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default NotFoundError;
