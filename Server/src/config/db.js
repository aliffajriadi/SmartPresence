// prisma.js
// Inisialisasi Prisma Client sebagai instance tunggal (singleton).
// File ini digunakan untuk menghindari multiple connection ke database,
// terutama saat aplikasi melakukan banyak import di berbagai module.
//
// Cara pakai di module lain:
//    import prisma from "../config/prisma.js";
//    prisma.user.findMany()

import { PrismaClient } from "@prisma/client";

// Membuat satu instance Prisma yang akan digunakan oleh seluruh aplikasi
const prisma = new PrismaClient();

export default prisma;

// Alur kerja:
// 1. Import PrismaClient dari @prisma/client.
// 2. Buat instance PrismaClient.
// 3. Export instance PrismaClient sebagai default.