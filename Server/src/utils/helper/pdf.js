// ./src/utils/helper/pdf.js

/* ----------------------------------------------------------------------------
   Helper: createPDF()
   Deskripsi:
   - Utility untuk membuat file PDF profesional menggunakan PDFKit.
   - Mendukung fitur:
       ✓ Header (logo + title + subtitle)
       ✓ Tabel otomatis (dengan kolom "No")
       ✓ Auto page-break saat tabel melewati batas halaman
       ✓ Footer timestamp
       ✓ Validasi input & validasi logo
       ✓ Perhitungan lebar kolom otomatis
   - Cocok digunakan untuk membuat:
       • Rekap absensi
       • Rekap nilai
       • Laporan harian/bulanan
       • Invoice sederhana
       • Dokumen formal lain yang membutuhkan layout tabel

   Struktur Utama:
   1. validateInput()      → Validasi parameter wajib
   2. validateLogo()       → Cek path logo
   3. drawHeader()         → Menggambar logo + judul + subjudul
   4. calculateColumnWidths() → Hitung lebar kolom otomatis
   5. drawTableHeader()    → Header tabel
   6. drawTableRows()      → Baris tabel + auto page break
   7. drawTable()          → Wrapper tabel (tambah kolom "No")
   8. drawFooter()         → Footer timestamp
   9. createPDF()          → Fungsi utama pembuat PDF

   ---------------------------------------------------------------------------

   Alur Kerja Fungsi createPDF():

   1. VALIDASI
      - Mengecek apakah filename, title, dan table diberikan dengan format benar.
      - Jika tidak valid → throw error agar tidak membuat PDF rusak.

   2. SIAPKAN FILE OUTPUT
      - Membuat folder otomatis jika belum ada.
      - Menyiapkan PDFDocument dari PDFKit.

   3. HEADER
      - Jika logo ditemukan:
            → Gambar logo (80x80)
            → Judul bergeser ke kanan
      - Menampilkan Title dan Subtitle dengan font Helvetica (Clean & Modern)

   4. TABEL
      - Menambahkan kolom otomatis "No"
      - Mengambil nama kolom dari object pertama
      - Menghitung lebar kolom secara otomatis berdasarkan jumlah kolom
      - Menggambar table header
      - Menggambar semua baris:
            • Jika melebihi batas halaman → otomatis pindah halaman baru

   5. FOOTER
      - Jika `showFooter` diset true:
            → Menuliskan date-time generate pada bawah halaman terakhir

   6. SELESAI
      - Menutup dokumen PDF
      - Resolve promise ketika file selesai ditulis

   ---------------------------------------------------------------------------

   Contoh Penggunaan:

     import { createPDF } from "./src/utils/helper/pdf.js";

     createPDF({
        filename: "rekap/rekap_absensi_IF1A.pdf",
        logoPath: "./assets/logo.png",
        title: "Rekap Absensi Kelas IF-1A",
        subtitle: "Periode: November 2025",
        table: [
          { Nama: "Alif", NIP: "112233", Kehadiran: 20, Terlambat: 1 },
          { Nama: "Budi", NIP: "223344", Kehadiran: 18, Terlambat: 3 },
        ],
     }).then(() => console.log("PDF selesai dibuat!"));

   ---------------------------------------------------------------------------

   Catatan:
   - Jika kamu ingin custom ukuran kolom (misalnya kolom "No" lebih kecil),
     edit fungsi calculateColumnWidths().
   - Jika ingin styling font lebih keren (misalnya pakai font custom),
     tinggal tambah doc.registerFont() sebelum drawHeader().
   - Helper ini dibuat modular sehingga setiap fungsi dapat di-upgrade
     (misalnya menambahkan watermark, QR code, tanda tangan digital, dll).

---------------------------------------------------------------------------- */


import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// Constants
const COLORS = {
  primary: "#1a1a1a",
  secondary: "#666666",
  headerBg: "#f5f5f5",
  border: "#e0e0e0",
};

const SPACING = {
  margin: 50,
  headerHeight: 100,
  rowHeight: 30,
  lineWidth: 1,
};

const FONT_SIZES = {
  title: 24,
  subtitle: 11,
  tableHeader: 11,
  tableBody: 10,
};

// ======================= VALIDATION =======================
const validateInput = (params) => {
  const { filename, title, table } = params;

  if (!filename || typeof filename !== "string") {
    throw new Error("filename is required and must be a string");
  }
  if (!title || typeof title !== "string") {
    throw new Error("title is required and must be a string");
  }
  if (!Array.isArray(table)) {
    throw new Error("table must be an array");
  }
};

// ======================= LOGO VALIDATION =======================
const validateLogo = (logoPath) => {
  if (!logoPath) return false;
  try {
    return fs.existsSync(logoPath) && fs.statSync(logoPath).isFile();
  } catch {
    return false;
  }
};

// ======================= HEADER =======================
const drawHeader = (doc, { logoPath, title, subtitle }) => {
  const startX = SPACING.margin;
  const startY = SPACING.margin;

  let titleX = startX;

  // Draw logo
  if (validateLogo(logoPath)) {
    doc.image(logoPath, startX, startY, {
      width: 80,
      height: 80,
    });
    titleX = startX + 120;
  }

  // Title
  doc
    .fontSize(FONT_SIZES.title)
    .fillColor(COLORS.primary)
    .font("Helvetica-Bold")
    .text(title, titleX, startY, { width: 400 });

  // Subtitle
  if (subtitle) {
    doc
      .fontSize(FONT_SIZES.subtitle)
      .fillColor(COLORS.secondary)
      .font("Helvetica")
      .text(subtitle, titleX, startY + 35, { width: 400 });
  }

  return startY + SPACING.headerHeight;
};

// ======================= COLUMN WIDTH =======================
const calculateColumnWidths = (table, maxWidth) => {
  const columns = Object.keys(table[0]);
  const count = columns.length;
  
  // Tentukan lebar kolom "No" secara spesifik
  const noColumnWidth = 35; 
  
  // Hitung sisa ruang untuk kolom lainnya
  const remainingWidth = maxWidth - noColumnWidth;
  const otherColumnWidth = remainingWidth / (count - 1);

  return columns.map((col) => {
    // Jika kolom adalah "No", gunakan lebar kecil, jika bukan gunakan sisa bagi rata
    return col === "No" ? noColumnWidth : otherColumnWidth;
  });
};

// ======================= TABLE HEADER =======================
const drawTableHeader = (doc, columns, startX, startY, columnWidths) => {
  const headerHeight = SPACING.rowHeight;
  const totalWidth = columnWidths.reduce((a, b) => a + b, 0);

  doc.fillColor(COLORS.headerBg).rect(startX, startY, totalWidth, headerHeight).fill();
  doc.strokeColor(COLORS.border).lineWidth(SPACING.lineWidth).rect(startX, startY, totalWidth, headerHeight).stroke();

  doc.fontSize(FONT_SIZES.tableHeader).fillColor(COLORS.primary).font("Helvetica-Bold");

  let x = startX;
  columns.forEach((col, i) => {
    doc.text(col.toUpperCase(), x + 8, startY + 8, {
      width: columnWidths[i] - 16,
      align: "left",
      ellipsis: true,
    });
    x += columnWidths[i];
  });

  return startY + headerHeight;
};

// ======================= TABLE ROWS (AUTO PAGE BREAK) =======================
const drawTableRows = (doc, table, columns, startX, startY, columnWidths) => {
  const rowHeight = SPACING.rowHeight;
  const totalWidth = columnWidths.reduce((a, b) => a + b, 0);

  let y = startY;

  doc.fontSize(FONT_SIZES.tableBody).font("Helvetica");

  table.forEach((row) => {
    // Jika mepet bawah → buat halaman baru (tanpa header)
    if (y + rowHeight > doc.page.height - 60) {
      doc.addPage();
      y = SPACING.margin; // Start row di halaman baru
    }

    // Draw border
    doc.strokeColor(COLORS.border).rect(startX, y, totalWidth, rowHeight).stroke();

    // Draw row text
    let x = startX;
    columns.forEach((col, i) => {
      doc.text(String(row[col]), x + 8, y + 8, {
        width: columnWidths[i] - 16,
        align: "left",
        ellipsis: true,
      });
      x += columnWidths[i];
    });

    y += rowHeight;
  });

  return y;
};

// ======================= DRAW TABLE WRAPPER =======================
const drawTable = (doc, table, startY) => {
  if (!table.length) return startY;

  // Tambah kolom "No"
  const processed = table.map((row, i) => ({ No: i + 1, ...row }));

  const columns = Object.keys(processed[0]);
  const startX = SPACING.margin;
  const maxWidth = doc.page.width - SPACING.margin * 2;

  const columnWidths = calculateColumnWidths(processed, maxWidth);

  // Draw header (hanya halaman pertama)
  let y = drawTableHeader(doc, columns, startX, startY, columnWidths);

  // Draw rows (multi-page)
  return drawTableRows(doc, processed, columns, startX, y, columnWidths);
};

// ======================= FOOTER =======================
const drawFooter = (doc) => {
  doc
    .fontSize(9)
    .fillColor(COLORS.secondary)
    .text(`Generated on ${new Date().toLocaleString()}`, SPACING.margin, doc.page.height - 40);
};

// ======================= MAIN FUNCTION =======================
export const createPDF = ({
  filename,
  title,
  subtitle = "",
  logoPath,
  table = [],
  showFooter = true,
}) => {
  return new Promise((resolve, reject) => {
    try {
      validateInput({ filename, title, table });

      const output = filename.endsWith(".pdf") ? filename : filename + ".pdf";
      fs.mkdirSync(path.dirname(output), { recursive: true });

      const doc = new PDFDocument({ margin: SPACING.margin, bufferPages: true });
      const stream = fs.createWriteStream(output);

      doc.pipe(stream);

      // Header
      let y = drawHeader(doc, { logoPath, title, subtitle });

      // Table
      drawTable(doc, table, y);

      // Footer
      if (showFooter) drawFooter(doc);

      doc.end();

      stream.on("finish", () => resolve(output));
    } catch (err) {
      reject(err);
    }
  });
};

export default createPDF;
