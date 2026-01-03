import express from "express";
import * as rfidService from "./rfid.service.js";
import { validateId } from "../../middleware/validateId.js";
import { sanitizeQuery } from "../../utils/helper/sanitizeQuery.js";
import { successResponse, errorResponse } from "../../utils/helper/response.js";

const router = express.Router();

// /api/rfid

//GET USER BY RFID
router.get("/:rfid", async (req, res) => {
    if (!req.params.rfid) {
        return errorResponse(res, "No RFID provided", 400);
    }
    try {
        const rfid = await rfidService.getUserByRfid(req.params.rfid);
        return successResponse(res, "RFID retrieved successfully", rfid);
    } catch (error) {
        return errorResponse(res, error.message, 404);
    }
});

export default router;



