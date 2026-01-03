import express from "express";
import FormData from "form-data";
import axios from "axios";
import * as userService from "./user.service.js";
import { validateId } from "../../middleware/validateId.js";
import { authenticate } from "../../middleware/authJWT.js";
import { authorizeRoles } from "../../middleware/roleMiddleware.js";
import { sanitizeQuery } from "../../utils/helper/sanitizeQuery.js";
import { successResponse, errorResponse } from "../../utils/helper/response.js";
import multer from "multer";
import { logActivity } from "../../utils/helper/log.js";

const router = express.Router();
// Multer untuk simpan sementara
const storage = multer.memoryStorage(); // simpan di memory agar bisa langsung dikirim
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only jpg, jpeg, png, webp allowed."),
      false
    );
  }
};

// Limits ukuran file: 4 MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4 MB
});

// /api/user

// 🔹 GET ALL USERS
router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "guru"),
  async (req, res) => {
    const filter = sanitizeQuery(req.query, ["page", "limit", "role"]);
    try {
      const users = await userService.getAllUsersPaginated(filter);
      return successResponse(res, "Users retrieved successfully", { ...users });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
);

// 🔹 GET USER BY ID
router.get("/:id", validateId, authenticate, async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return errorResponse(res, "User not found", 404);
    return successResponse(res, "User retrieved successfully", user);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// 🔹 GET USER PROFILE
router.get("/profile/me", authenticate, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) return errorResponse(res, "Profile not found", 404);
    return successResponse(res, "Profile retrieved successfully", user);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// 🔹 CREATE USER
router.post("/", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    await logActivity(req, "create_user", req.user.id);
    return successResponse(res, "User created successfully", newUser, 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
});

// 🔹 UPDATE USER (ADMIN)
router.patch(
  "/:id",
  validateId,
  authenticate,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
      if (!updatedUser) return errorResponse(res, "User not found", 404);
      return successResponse(res, "User updated successfully", updatedUser);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }
);

// 🔹 UPDATE USER PROFILE
router.patch("/profile/me", authenticate, async (req, res) => {
  try {
    const updatedProfile = await userService.updateUser(
      req.user.id,
      req.body,
      req
    );
    if (!updatedProfile) return errorResponse(res, "Profile not found", 404);
    return successResponse(res, "Profile updated successfully", updatedProfile);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
});

// 🔹 DELETE USER
router.delete(
  "/:id",
  validateId,
  authenticate,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const deletedUser = await userService.deleteUser(req.params.id);
      if (!deletedUser) return errorResponse(res, "User not found", 404);
      await logActivity(
        req,
        `delete_user ${deletedUser.name} ${deletedUser.role}`,
        req.user.id
      );
      return successResponse(res, "User deleted successfully", deletedUser);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
);

// 🔹 PATCH USER (PARTIAL UPDATE)
router.patch(
  "/:id",
  validateId,
  authenticate,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
      if (!updatedUser) return errorResponse(res, "User not found", 404);
      return successResponse(res, "User updated successfully", updatedUser);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }
);

// 🔹 GET 1 USER BY QUERY
router.get(
  "/uniq/one",
  authenticate,
  authorizeRoles("admin", "guru"),
  async (req, res) => {
    const filter = sanitizeQuery(req.query, [
      "id",
      "name",
      "nohp",
      "nis",
      "nip",
    ]);
    if (
      !filter.id &&
      !filter.name &&
      !filter.nohp &&
      !filter.nis &&
      !filter.nip
    ) {
      return errorResponse(res, "No filter provided", 400);
    }

    try {
      const user = await userService.getUniqUsersByExactFilter(filter);
      if (!user) return errorResponse(res, "User not found", 404);
      return successResponse(res, "User retrieved successfully", user);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
);

// 🔹 GET MANY USERS BY QUERY
router.get("/many/all", authenticate, async (req, res) => {
  const filter = sanitizeQuery(req.query, ["role", "page", "limit"]);
  try {
    const users = await userService.getManyUsersByExactFilter(filter);
    return successResponse(res, "Users retrieved successfully", users);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// 🔹 SEARCH USERS
router.get(
  "/search/all",
  authenticate,
  authorizeRoles("admin"),
  async (req, res) => {
    const query = sanitizeQuery(req.query, ["query", "page", "limit", "role"]);
    try {
      const users = await userService.searchUsers(query);
      return successResponse(res, "Search completed successfully", users);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
);

// UPDATE PHOTO PROFILE
router.patch(
  "/update/photo",
  authenticate,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) return errorResponse(res, "No file uploaded", 400);

      const profile = await userService.getUserById(req.user.id);
      const form = new FormData();
      form.append("file", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
      let response;

      if (profile.photo !== "default") {
        // Hapus foto lama
        axios.get(
          `https://jokilek.diskon.com/storage/delete.php?key=123alif&filename=${profile.photo}`
        );
      }

      // Upload foto baru
      response = await axios.post(
        `https://jokilek.diskon.com/storage/upload.php?key=123alif`,
        form,
        { headers: form.getHeaders() } // gunakan form.getHeaders() biar multipart benar
      );
      // Update database dengan filename baru
      const updatedProfile = await userService.updateUser(req.user.id, {
        photo: response.data.filename,
      });
      await logActivity(req, "update_photo_profile", req.user.id);
      return successResponse(
        res,
        "Profile updated successfully",
        updatedProfile
      );
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }
);

router.patch("/profile/password", authenticate, async (req, res) => {
  const { password, confirm_password } = req.body || {};
  if (!password || !confirm_password)
    return errorResponse(res, "Password dan new_password harus diisi", 400);
  try {
    const updatedProfile = await userService.updatePasswordProfile(
      req.user.id,
      req.body
    );
    if (!updatedProfile) return errorResponse(res, "Profile not found", 404);
    await logActivity(req, "update_password_profile", req.user.id);
    return successResponse(res, "Password Berhasil di ubah", updatedProfile);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
});

router.get("/profile/activity", authenticate, async (req, res) => {
  const filter = sanitizeQuery(req.query, ["page", "limit"]);
  filter.id = req.user.id;
  try {
    const activity = await userService.getLogActivityProfile(filter);
    return successResponse(res, "Activity retrieved successfully", activity);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

router.get("/profile/activity-detail", authenticate, async (req, res) => {
  const filter = sanitizeQuery(req.query, "id");
  try {
    const activity = await userService.getLogActivityProfileDetail(
      req.user.id,
      Number(filter.id)
    );
    return successResponse(res, "Activity retrieved successfully", activity);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

export default router;
