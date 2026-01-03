import express from "express";
import { authenticate } from "../../middleware/authJWT.js";
import { authorizeRoles } from "../../middleware/roleMiddleware.js";
import { sanitizeQuery } from "../../utils/helper/sanitizeQuery.js";
import { successResponse, errorResponse } from "../../utils/helper/response.js";
import * as laporanService from "./laporan.service.js";
import { limiterUser } from "../../middleware/rateLimiter.js";

const router = express.Router();


router.get("/absensi", authenticate, authorizeRoles("admin"), async (req, res) => {
    const filter = sanitizeQuery(req.query, ["periode", "kelas", "tanggal"]);
    try {
        await laporanService.getAbsensi(filter);
        return successResponse(res, "Laporan data berhasil diambil", {});
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
})

// AMBIL LAPORAN ABSENSI LEWAT uniq no HP (UNTUK DI WHATSAPP)
// CARA PAKAI 
// /api/laporan/laporan-profile-wa?nohp=628123456789&periode=1
// PERIODE 
// 1 : 7 hari terakhir
// 2 : 30 hari terakhir
// 3 : 90 hari terakhir
// 4 : 180 hari terakhir
// 5 : 360 hari terakhir
// 6 : hari ini
router.get("/laporan-profile-wa", async (req, res) => {
    const filter = sanitizeQuery(req.query, ["nohp", "periode"]);
    filter.mode = "wa"
    try {
        const getUser = await laporanService.getLaporanProfile(filter);
        return res.download(getUser);
        // return successResponse(res, "Laporan data berhasil diambil", getUser);
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
})

// AMBIL LAPORAN ABSENSI SISWA UNTUK WEB, UNIQ DI AMBIL LEWAT AUTH
// CARA PAKAI 
// /api/laporan/laporan-profile-web?nohp=628123456789&periode=1
// PERIODE 
// 1 : 7 hari terakhir
// 2 : 30 hari terakhir
// 3 : 90 hari terakhir
// 4 : 180 hari terakhir
// 5 : 360 hari terakhir
// 6 : hari ini
router.get("/laporan-profile-web", authenticate, limiterUser(1, 2), authorizeRoles("siswa"), async (req, res) => {
    const filter = sanitizeQuery(req.query, "periode");
    filter.id = req.user.id
    filter.nama = req.user.name
    filter.nisn = req.user.nisn
    filter.mode = "web"
    try {
        const getUser = await laporanService.getLaporanProfile(filter);
        return res.download(getUser);
        // return successResponse(res, "Laporan data berhasil diambil", getUser);
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
})

router.get("/last-activity", authenticate, authorizeRoles("admin"), async (req, res) => {
    try {
        const lastActivity = await laporanService.getLastActivity();
        return successResponse(res, "Laporan data berhasil diambil", lastActivity);
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
})

router.get("/admin-laporan", authenticate, authorizeRoles("admin"), async (req, res) => {
    const filter = sanitizeQuery(req.query, ["periode"]);
    try {
        const lastActivity = await laporanService.getAdminLaporan(filter);
        return res.download(lastActivity);
        // return successResponse(res, "Laporan data berhasil diambil", lastActivity);
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
})

router.get("/kelas-id", authenticate, authorizeRoles("admin", "guru"), async (req, res) => {
    const filter = sanitizeQuery(req.query, ["id"]);

    try {
        const lastActivity = await laporanService.getKelasId(Number(filter.id));
        return res.download(lastActivity);
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
})

router.get("/statistik", authenticate, authorizeRoles("admin"), async (req, res) => {
    try {
        const dataStatistik = await laporanService.getStatistik();
        return successResponse(res, "Laporan data berhasil diambil", dataStatistik);
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
})

export default router;