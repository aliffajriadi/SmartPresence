import { createPDF } from "./src/utils/helper/pdf.js";
import { getDateString } from "./src/utils/helper/date.js";

const generate300Data = () => {
  const names = [
    "Alif Fajriadi", "Budi", "Citra", "Dina", "Eka", "Farhan", "Gita", "Hana",
    "Imam", "Joko", "Kiki", "Lala", "Mega", "Nina", "Omar", "Putri",
    "Qila", "Raka", "Salsa", "Toni", "Umar", "Vina", "Wawan", "Xena",
    "Yani", "Zaki"
  ];

  const data = [];

  for (let i = 1; i <= 300; i++) {
    const randomName = names[Math.floor(Math.random() * names.length)] + " " + i;
    const randomNip = Math.floor(Math.random() * 9000000 + 1000000).toString();
    const randomHad = Math.floor(Math.random() * 120 + 1);
    const randomTelat = Math.floor(Math.random() * 5);

    data.push({
      Nama: randomName,
      NIP: randomNip,
      Kehadiran: randomHad,
      Keterlambatan: randomTelat
    });
  }

  return data;
};

// Contoh pakai
createPDF({
  filename: "rekap_absen.pdf",
  logoPath: "./assets/logo1.png",
  title: "Rekap Absensi Kelas IF-1A",
  subtitle: `Periode: November 2025\nTahun Ajaran: 2025/2026\nDibuat pada: ${getDateString()}`,
  table: generate300Data()
}).then(() => console.log("PDF Rekap dibuat!"));
