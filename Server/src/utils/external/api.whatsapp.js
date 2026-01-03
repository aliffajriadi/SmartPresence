// api.whatsapp.js
import axios from "axios";

const BASE_URL = "https://api.aliffajriadi.my.id/botwa/api/kirim";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.API_WHATSAPP_KEY,
  },
});

// -----------------------------------------------------------------------------
// Kirim pesan teks
// -----------------------------------------------------------------------------
export const sendWhatsappMessage = async (nomor, pesan) => {
  try {
    const response = await axiosInstance.post("/", { nomor, pesan });
    return response.data;
  } catch (err) {
    console.error("❌ Gagal kirim WA (text):", {
      status: err.response?.status,
      data: err.response?.data,
    });

    return {
      success: false,
      message: "Pesan gagal dikirim",
    };
  }
};

// -----------------------------------------------------------------------------
// Kirim pesan + file
// -----------------------------------------------------------------------------
export const sendWhatsappFileMessage = async (nomor, pesan, file) => {
  try {
    const response = await axiosInstance.post("/file", {
      nomor,
      pesan,
      file,
    });

    return response.data;
  } catch (err) {
    console.error("❌ Gagal kirim WA (file):", {
      status: err.response?.status,
      data: err.response?.data,
    });

    return {
      success: false,
      message: "Pesan + file gagal dikirim",
    };
  }
};
