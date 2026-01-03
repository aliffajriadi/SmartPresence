import express from "express";
import * as authService from "./auth.service.js";
import { successResponse, errorResponse } from "../../utils/helper/response.js";
import { limiterIp } from "../../middleware/rateLimiter.js";

const router = express.Router();

// PRODUCTION_MODE = "true" → production
const isProd = process.env.PRODUCTION_MODE === "true";

router.post("/login", limiterIp, async (req, res) => {
  const loginData = req.body;

  if (!loginData.role || !loginData.password) {
    return res.status(400).json({ message: "Invalid field login data" });
  }

  try {
    const { user, token } = await authService.login(loginData, req);

    const cookieOptions = {
      httpOnly: true,
      secure: isProd,                     // HTTPS only on production
      sameSite: isProd ? "none" : "lax", // CORS safe rule
      maxAge: 8400000,                   // 1 hour
      path: "/",
      ...(isProd && { domain: process.env.COOKIE_DOMAIN }), // domain only on prod
    };

    res.cookie("token", token, cookieOptions);
    return successResponse(res, "Login successful", user);

  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
});

/* ----------------------------------------------------------------------------
  LOGOUT
---------------------------------------------------------------------------- */
router.post("/logout", (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    ...(isProd && { domain: process.env.COOKIE_DOMAIN }),
  };

  res.clearCookie("token", cookieOptions);
  return successResponse(res, "Logout successful");
});

export default router;
