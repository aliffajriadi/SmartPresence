// src/utils/helper/jwt.js

// Import library jsonwebtoken untuk membuat, memverifikasi,
// dan mendecode JWT (JSON Web Token)
import jwt from "jsonwebtoken";

/* ----------------------------------------------------------------------------
   Fungsi: generateToken(payload, expiresIn)
   - Membuat JWT token berdasarkan data payload.
   - Token ditandatangani menggunakan secret dari environment variable.
   - expiresIn menentukan masa berlaku token (contoh: "1h", "7d", 3600).
   
   Alur Kerja:
   1. Menerima payload (object) yang ingin dimasukkan ke token.
   2. Menggunakan jwt.sign() untuk membuat token.
   3. Mengembalikan token dalam format string.

   Contoh penggunaan:
     const token = generateToken({ id: user.id, role: user.role }, "1h");
---------------------------------------------------------------------------- */
export const generateToken = (payload, expiresIn) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/* ----------------------------------------------------------------------------
   Fungsi: verifyToken(token)
   - Memverifikasi apakah token valid dan belum kedaluwarsa.
   - Mengembalikan payload token jika valid.

   Alur Kerja:
   1. Menerima token dari cookie/header.
   2. Menjalankan jwt.verify() dengan secret.
   3. Jika token valid → return payload.
   4. Jika tidak valid/expired → lempar error.

   Contoh penggunaan (di middleware authenticate):
     const user = verifyToken(token);
---------------------------------------------------------------------------- */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // Error bisa karena token invalid atau expired
    throw new Error("Invalid or expired token");
  }
};

/* ----------------------------------------------------------------------------
   Fungsi: decodeToken(token)
   - Mendecode token tanpa verifikasi signature.
   - Berguna untuk mengambil data dasar sebelum proses verifikasi,
     atau debugging.
   - Tidak aman untuk autentikasi!

   Alur Kerja:
   1. Menerima token.
   2. jwt.decode() hanya membaca payload tanpa cek validitas.
   3. Mengembalikan object payload atau null.

   Contoh penggunaan:
     const data = decodeToken(token);
---------------------------------------------------------------------------- */
export const decodeToken = (token) => {
  return jwt.decode(token);
};
