// src/utils/helper/response.js

/* ----------------------------------------------------------------------------
   Fungsi: successResponse(res, message, data, code = 200)
   - Mengirimkan response standar untuk permintaan yang berhasil.
   - Mencegah duplikasi kode dan membuat struktur API konsisten.

   Alur kerja:
   1. Menerima objek response Express.
   2. Menerima pesan (message) dan data yang ingin dikembalikan.
   3. Mengirimkan JSON dengan status success: true.

   Contoh penggunaan:
     return successResponse(res, "Data ditemukan", userData);
---------------------------------------------------------------------------- */
export const successResponse = (res, message, data, code = 200) => {
  return res.status(code).json({
    success: true,
    message,
    data,
  });
};

/* ----------------------------------------------------------------------------
   Fungsi: errorResponse(res, message, code = 400)
   - Mengirimkan response standar untuk error.
   - Membuat struktur error seragam agar mudah diproses di frontend.

   Alur kerja:
   1. Menerima objek response Express.
   2. Menerima pesan error.
   3. Mengirimkan JSON dengan status success: false.

   Contoh penggunaan:
     return errorResponse(res, "User tidak ditemukan", 404);
---------------------------------------------------------------------------- */
export const errorResponse = (res, message, code = 400) => {
  return res.status(code).json({
    success: false,
    message,
  });
};
