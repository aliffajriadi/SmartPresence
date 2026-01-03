import express from "express";
import * as absensiService from "./absensi.service.js";
import { authenticate } from "../../middleware/authJWT.js";
import { successResponse, errorResponse } from "../../utils/helper/response.js";
import { authorizeRoles } from "../../middleware/roleMiddleware.js";
import { sanitizeQuery } from "../../utils/helper/sanitizeQuery.js";
import { validateId } from "../../middleware/validateId.js";

const router = express.Router();
// /api/absensi

//GET TOTAL ABSENSI STATISTIK ADMIN
router.get("/total", authenticate, authorizeRoles("admin"), async (req, res) => {
    try {
        const absensi = await absensiService.getTotalAbsensi();
        return successResponse(res, "Absensi retrieved successfully", absensi);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
});
router.get("/statistik/profile-siswa", authenticate, authorizeRoles("siswa"), async (req, res) => {
    try {
        const absensi = await absensiService.getStatistikAbsensiProfileSiswa(req.user.id);
        return successResponse(res, "Absensi retrieved successfully", absensi);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
});

router.get("/siswa-table/profile", authenticate, authorizeRoles("siswa"), async (req, res) => {
    const filter = sanitizeQuery(req.query, ["page", "limit", "periode"]);
    filter.id = req.user.id
    try {
        const absensi = await absensiService.getSiswaAbsensiTable(filter);
        return successResponse(res, "Absensi retrieved successfully", absensi);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
})

router.get("/detail-absensi/kelas/:id", authenticate, validateId, authorizeRoles("siswa"), async (req, res) => {
    const id = req.params.id
    try {
        const absensi = await absensiService.getDetailAbsensiKelas(id, req.user.id);
        return successResponse(res, "Absensi retrieved successfully", absensi);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
});



export default router;