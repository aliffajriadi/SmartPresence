import express from "express";
import * as kelasService from "./kelas.service.js";
import { sanitizeQuery } from "../../utils/helper/sanitizeQuery.js";
import { successResponse, errorResponse } from "../../utils/helper/response.js";
import { authenticate } from "../../middleware/authJWT.js";
import { authorizeRoles } from "../../middleware/roleMiddleware.js";


const router = express.Router();
// /api/kelas

//TEST RFID KETIKA DI TAP LEWAT API SEMENTARA, NNTI DIPINDAHIN LEWAT MQTT AJA
router.post("/:rfid", async (req, res) => {
    if (!req.params.rfid) {
        return res.status(400).json({ message: "No RF ID provided" });
    }
    try {
        const kelas = await kelasService.tapRFID(req.params.rfid);
        return successResponse(res, "Laporan data berhasil diambil", kelas);
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
})


//GET LAPORAN KELAS
router.get("/", async (req, res) => {
    const data = sanitizeQuery(req.query, ["waktu", "page", "limit", "ruangan", "olehguru"]);
    try {
        const kelas = await kelasService.getAllKelas();
        return successResponse(res, "Laporan data berhasil diambil", kelas);
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
})


router.get("/kelas-ajar", authenticate, authorizeRoles("guru"), async (req, res) => {
    try {
        const kelas = await kelasService.getKelasAjar(req.user.id);
        return successResponse(res, "Laporan data berhasil diambil", kelas);
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
});

router.get("/kelas-siswa", authenticate, authorizeRoles("guru", "admin"), async (req, res) => {
    const filter = sanitizeQuery(req.query, ["page", "limit", "id"]);
    try {
        const kelas = await kelasService.getKelasSiswa(filter);
        return successResponse(res, "Laporan data berhasil diambil", kelas);
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
});

router.get("/realtime-sesi", authenticate, authorizeRoles("guru"), async (req, res) => {
    try {
        const kelas = await kelasService.getRealtimeSesi(req.user.id);
        return successResponse(res, "Laporan data berhasil diambil", kelas);
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
});

router.get("/sesi-admin", authenticate, authorizeRoles("admin"), async (req, res) => {
    const filter = sanitizeQuery(req.query, ["page", "limit", "id"]);
    try {
        const kelas = await kelasService.getRealtimeSesi(filter);
        return successResponse(res, "Laporan data berhasil diambil", kelas);
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
});

router.get("/all", authenticate, authorizeRoles("admin"), async (req, res) => {
    try {
        const kelas = await kelasService.getAllKelas();
        return successResponse(res, "Laporan data berhasil diambil", kelas);
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
});




export default router;