import express from "express";
import { successResponse, errorResponse } from "../../utils/helper/response.js";
import * as resetpasswordService from "./resetpassword.service.js";
import { limiterByBody } from "../../middleware/rateLimiter.js";
const router = express.Router();

router.post("/", limiterByBody(10, 5, "nohp", "Nomor ini sudah meminta OTP terlalu banyak. Silakan tunggu."), async (req, res) => {
    const { role, nohp, ni } = req.body;
    if ( !role || !nohp || !ni ) {
        return res.status(400).json({ message: "Invalid field data" });
    }
    try {
        const user = await resetpasswordService.getOTPpassword(role, nohp, ni);
        return successResponse(res, "Kode OTP berhasil dikirim", user);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
});

router.post("/verify", limiterByBody(10, 5, "otp", "Kode OTP sudah terlalu banyak. Silakan tunggu."), async (req, res) => {
    const { id, otp } = req.body;
    if (!id || !otp) {
        return res.status(400).json({ message: "Invalid field data" });
    }
    try {
        const user = await resetpasswordService.verifyOTP(id, otp);
        return successResponse(res, "Kode OTP berhasil dikirim", user);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
})

router.post("/update", limiterByBody(10, 5, "reset_token", "Percobaan update password sudah terlalu banyak. Silakan tunggu."), async (req, res) => {
    const { reset_token, new_password } = req.body;
    if (!reset_token || !new_password) {
        return res.status(400).json({ message: "Invalid field data" });
    }
    try {
        const user = await resetpasswordService.finalizeResetPassword(reset_token, new_password);
        return successResponse(res, "Password berhasil diupdate", user);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
})


export default router;