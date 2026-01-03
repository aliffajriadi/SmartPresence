// src/utils/bcrypt.js

// Import library bcrypt untuk hashing dan membandingkan password
import bcrypt from "bcrypt";

// Mengambil nilai saltRounds dari environment variable.
// Jika tidak ada, default-nya adalah 10.
// Catatan:
// - Semakin besar angka saltRounds → hashing lebih aman tetapi lebih lambat
// - Nilai 10–12 sudah standar industri
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

/* ---------------------------------------------------------------------------
   HASH PASSWORD (Digunakan saat REGISTER)
   ---------------------------------------------------------------------------
   Alur kerja:
   1. User mengirim password plaintext dari form register.
   2. Fungsi hashPassword() menerima password tersebut.
   3. bcrypt membuat salt lalu meng-hash password.
   4. Hasil hash dikembalikan, kemudian disimpan ke database.

   Contoh pemakaian:
     const hashed = await hashPassword("passwordUser");
     await db.users.insert({ password: hashed });
--------------------------------------------------------------------------- */
export const hashPassword = async (password) => {
  try {
    // bcrypt.hash() secara otomatis:
    // - membuat salt
    // - melakukan hashing dengan salt tersebut
    return await bcrypt.hash(password, saltRounds);
  } catch (err) {
    console.error("Error hashing password:", err);
    throw new Error("Hashing failed");
  }
};

/* ---------------------------------------------------------------------------
   COMPARE PASSWORD (Digunakan saat LOGIN)
   ---------------------------------------------------------------------------
   Alur kerja:
   1. User memasukkan password plaintext saat login.
   2. Sistem mengambil password yang sudah di-hash dari database.
   3. Fungsi comparePassword() menerima dua nilai:
        - plaintext (input user)
        - hashed password (dari database)
   4. bcrypt.compare() membandingkan apakah keduanya cocok.
   5. Hasil true/false dikembalikan.

   Contoh pemakaian:
     const valid = await comparePassword(inputUser, user.password);
     if (!valid) return "Password salah";
--------------------------------------------------------------------------- */
export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (err) {
    console.error("Error comparing password:", err);
    throw new Error("Compare password failed");
  }
};
