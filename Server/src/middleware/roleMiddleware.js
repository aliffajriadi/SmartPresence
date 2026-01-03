// Middleware untuk mengotorisasi berdasarkan peran pengguna
// cara pakai tinggal panggil di router dengan fungsi authorizeRoles("admin", "guru")

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Akses ditolak" });
    }
    next();
  };
}
