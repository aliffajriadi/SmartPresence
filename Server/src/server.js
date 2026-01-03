// server.js
// Entry point utama aplikasi Express + Socket.IO

import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import initSocket from "./socket/index.js";

// Import module route
import userModule from "./modules/user/user.module.js";
import authModule from "./modules/auth/auth.module.js";
import rfidModule from "./modules/rfid/rfid.module.js";
import kelasModule from "./modules/kelas/kelas.module.js";
import absensiModule from "./modules/absensi/absensi.module.js";
import laporanModule from "./modules/laporan/laporan.module.js";
import resetpasswordModule from "./modules/lupa-password/resetpassword.module.js";

// MQTT (langsung jalan)
import "./mqtt/controller/mqttRoutes.js";

// Load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// Global Middleware
// ============================================================================
app.set("trust proxy", 1);

app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));

// CORS
const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",").map((url) => url.trim())
  : [];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// ============================================================================
// REGISTER API MODULES
// ============================================================================
authModule(app);
userModule(app);
rfidModule(app);
kelasModule(app);
absensiModule(app);
laporanModule(app);
resetpasswordModule(app);

// ============================================================================
// HTTP SERVER (WAJIB untuk Socket.IO)
// ============================================================================
const server = http.createServer(app);

// ============================================================================
// SOCKET.IO
// ============================================================================
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

initSocket(io);

// ============================================================================
// RUN SERVER
// ============================================================================
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server berjalan di http://0.0.0.0:${PORT}`);
});
