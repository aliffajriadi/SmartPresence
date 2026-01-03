// utils/helper/dateString.js

// Daftar nama hari dalam bahasa Indonesia
const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

// Daftar nama bulan dalam bahasa Indonesia
const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// Fungsi statis / global (tetap sama saat file diimport)
const date = new Date();
const hours = String(date.getHours()).padStart(2, "0");
const minutes = String(date.getMinutes()).padStart(2, "0");
const seconds = String(date.getSeconds()).padStart(2, "0");
export const dateString = `${days[date.getDay()]}, ${date.getDate()} ${
  months[date.getMonth()]
} ${date.getFullYear()} ${hours}:${minutes}:${seconds}`;

// Versi yang selalu update
export function getDateString() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  return `${days[now.getDay()]}, ${now.getDate()} ${
    months[now.getMonth()]
  } ${now.getFullYear()} ${h}:${m}:${s}`;
}

// Format tanggal mudah dibaca (contoh: "27 Januari 2025")
export function formatDate(dateInput) {
  if (!dateInput) return "-";
  const d = new Date(dateInput);
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

// Format waktu HH:MM:SS sekarang
export function formatTime() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/* -------------------------------------------------------------------------- */
/* Tambahan: Format "Hari, Jam:Menit" dari tanggal input (misal API)         */
/* Output contoh: "Sabtu, 13:09"                                             */
export function formatDayHour(dateInput) {
  if (!dateInput) return "-";
  const d = new Date(dateInput);
  const dayName = days[d.getDay()];
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${dayName}, ${hours}:${minutes}`;
}

/* Tambahan opsional: "X menit / jam / hari lalu" (relative time) */
export function timeAgo(dateInput) {
  if (!dateInput) return "-";
  const now = new Date();
  const past = new Date(dateInput);
  const diffMs = now - past; // selisih dalam ms
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  return `${diffDays} hari lalu`;
}
