import * as resetPasswordRepository from "./resetpassword.repository.js";
import { updateUser } from "../user/user.repository.js";
import * as bcrypt from "../../utils/helper/bcrypt.js";
import NodeCache from "node-cache";
import crypto from "crypto"; // Library bawaan Node.js untuk generate token
import { sendWhatsappMessage } from "../../utils/external/api.whatsapp.js";

// Kita set TTL (Time To Live) default 15 menit (900 detik)
const cache = new NodeCache({ stdTTL: 900 });

export const getOTPpassword = async (role, nohp, ni) => {
  if (!role || !nohp || !ni) {
    throw new Error("Role, nohp, and nomor induk are required");
  }

  if (role !== "guru" && role !== "siswa") {
    throw new Error("Invalid role");
  }

  nohp = nohp
    .replace(/\D/g, "") // 1. Hapus semua selain angka
    .replace(/^(0|620|\+620)/, "62") // 2. Ganti 0, 620, atau +620 menjadi 62
    .replace(/^8/, "628"); // 3. Jika mulai dari 8, tambahkan 62

  const getUser = await resetPasswordRepository.getUserById(role, nohp, ni);

  if (!getUser) {
    throw new Error("Kombinasi nohp dan nomor induk tidak ditemukan.");
  }

  const cekOTP = await resetPasswordRepository.getOTPpassword(getUser.id);


  if (cekOTP) {
    throw new Error("Anda sudah mengirimkan OTP Tunggu 2 menit.");
  }

  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let otp = "";

  for (let i = 0; i < 4; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  await resetPasswordRepository.updateOTP(getUser.id, otp);
  const otpChat = "`" + otp + "`";
  await sendWhatsappMessage(
    getUser.nohp,
    `*SmartPresence*
---------------------------------------
Kode OTP Anda: ${otpChat}

Kode ini berlaku selama *3 menit*.
Mohon jangan berikan kode ini kepada siapa pun untuk keamanan akun Anda.`
  );

  return { next: true, idUser: getUser.id };
};

export const verifyOTP = async (id, otp) => {
  if (!id || !otp) {
    throw new Error("ID dan OTP harus diisi.");
  }

  // 1. Ambil data OTP dari database berdasarkan ID User
  const otpData = await resetPasswordRepository.getOTPpassword(id);

  if (!otpData) {
    throw new Error("OTP tidak ditemukan atau sudah kedaluwarsa.");
  }

  // 2. Cocokkan kode OTP (Gunakan toUpperCase agar tidak case-sensitive)
  if (otpData.otp.toUpperCase() !== otp.toUpperCase()) {
    throw new Error("Kode OTP yang Anda masukkan salah.");
  }

  // 3. Cek apakah OTP sudah expired secara database (misal 2 menit tadi)
  if (new Date() > new Date(otpData.expiredAt)) {
    throw new Error("Kode OTP sudah kadaluwarsa. Silakan minta kode baru.");
  }

  // 4. GENERATE TEMPORARY TOKEN
  // Token ini yang akan digunakan di step terakhir (Update Password)
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 5. SIMPAN KE CACHE
  // Key: resetToken, Value: id user
  cache.set(resetToken, id);

  // 6. Hapus OTP di database (Opsional: agar tidak bisa dipakai lagi)
  await resetPasswordRepository.deleteOTP(id);

  return resetToken;
};

/**
 * Fungsi tambahan untuk tahap akhir: Reset Password
 */
export const finalizeResetPassword = async (resetToken, newPassword) => {
  // 1. Cek apakah token ada di cache
  const userId = cache.get(resetToken);

  if (!userId) {
    throw new Error("Sesi reset password berakhir. Silakan ulangi dari awal.");
  }

  const hashedPassword = await bcrypt.hashPassword(newPassword);

  const payload = {
    password: hashedPassword,
  };

  await updateUser(userId, payload);

  cache.del(resetToken);

  return "Password berhasil diperbarui.";
};
