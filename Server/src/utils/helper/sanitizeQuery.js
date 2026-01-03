// src/utils/helper/sanitizeQuery.js

/* ----------------------------------------------------------------------------
   Fungsi: sanitizeQuery(query, allowed)
   - Membersihkan query string agar hanya field yang diijinkan yang diproses.
   - Berguna untuk mencegah user mengirim query berbahaya atau tidak diperlukan.
   - Cocok untuk fitur filtering, pagination, search, sorting, dll.

   Alur Kerja:
   1. Menerima `query` dari req.query dan daftar field yang diperbolehkan (`allowed`).
   2. Melakukan loop pada setiap key di query.
   3. Jika key tersebut ada di daftar allowed:
        → simpan ke object sanitized.
   4. Mengembalikan object sanitized yang aman untuk dipakai.

   Contoh penggunaan di controller:
     const filters = sanitizeQuery(req.query, ["nama", "role", "status"]);
     const users = await prisma.user.findMany({ where: filters });

---------------------------------------------------------------------------- */
export const sanitizeQuery = (query, allowed) => {
  const sanitized = {};

  // Loop semua key pada query
  for (const key in query) {
    // Hanya tambahkan jika ada di daftar "allowed"
    if (allowed.includes(key)) {
      sanitized[key] = query[key];
    }
  }

  return sanitized;
};
