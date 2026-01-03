// Middleware untuk memvalidasi parameter ID pada URL.
// Memastikan ID yang diterima adalah angka valid sebelum diteruskan ke controller.
//
// Cara pakai di router:
//    router.get("/users/:id", validateId);
//
// Alur kerja:
// 1. Ambil parameter `id` dari req.params.
// 2. Konversi ke number menggunakan parseInt.
// 3. Jika bukan angka (NaN) → kirim respon 400 (Bad Request).
// 4. Jika valid → simpan ke req.userId untuk digunakan controller selanjutnya.
// 5. Panggil next() untuk melanjutkan request.


export const validateId = (req, res, next) => {
  const { id } = req.params;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID. ID must be a number." });
  }

  req.params.id = userId;
  next();
};
