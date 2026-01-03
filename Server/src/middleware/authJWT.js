// Middleware untuk memverifikasi JWT yang disimpan di cookie HttpOnly.
// Digunakan untuk melindungi route yang membutuhkan autentikasi.
//
// Cara pakai di router:
//    router.get("/profile", authenticate;
//
// Alur kerja:
// 1. Ambil token dari cookie bernama "token".
// 2. Jika token tidak ada → kirim respon 401 (unauthorized).
// 3. Verifikasi token menggunakan helper jwt.verifyToken.
// 4. Jika valid → simpan payload ke req.user dan lanjut ke next().
// 5. Jika tidak valid / expired → kirim pesan error sesuai jenisnya.


import * as jwt from "../utils/helper/jwt.js";
import { errorResponse } from "../utils/helper/response.js";

export const authenticate = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return errorResponse(res, "No token provided", 401);
  }

  try {
    req.user = jwt.verifyToken(token);
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return errorResponse(res, "Token expired", 401);
    }
    if (err.name === "JsonWebTokenError") {
      return errorResponse(res, "Invalid token", 401);
    }
    return errorResponse(res, "Unauthorized", 401);
  }
};

