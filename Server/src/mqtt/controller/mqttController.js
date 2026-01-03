// mqttController.js
// Controller yang menangani proses tap RFID melalui MQTT.
// Menerima payload dari topic MQTT, memprosesnya menggunakan service kelas,
// lalu mengirimkan kembali hasilnya melalui MQTT.
//
// Alur kerja:
// 1. Menerima pesan rfid (string).
// 2. Parse JSON → mendapatkan { message, ruangan }.
// 3. Memanggil tapRFID() untuk memproses absensi.
// 4. Mengirimkan hasil sukses atau error melalui mqttPublish.

import { tapRFID } from "../../modules/kelas/kelas.service.js";
import { mqttPublish } from "../mqttRouter.js";
import { io } from "../../server.js";

export const tapAbsen = async (rfid) => {
  const publishTopic = process.env.MQTT_PUBLISH;
  try {
    // Pastikan payload dapat diparse sebagai JSON
    const data = JSON.parse(rfid);

    // Opsi validasi minimal
    if (!data?.message || !data?.ruangan) {
      return mqttPublish(publishTopic, "Invalid payload format");
    }
    io.to("scan").emit("rfid:tap", data.message);

    // Proses absensi berdasarkan RFID & ruangan
    const result = await tapRFID(data.message, data.ruangan);

    // Publish hasil ke topic respons
    mqttPublish(publishTopic, result);

  } catch (error) {
    // Publish error ke MQTT
    mqttPublish(publishTopic, error.message);
  }
};
