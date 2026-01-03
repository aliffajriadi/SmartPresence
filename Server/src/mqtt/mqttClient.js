// mqttClient.js
// Inisialisasi koneksi MQTT client menggunakan konfigurasi environment.
// File ini bertugas membuat satu instance client yang dapat digunakan
// oleh seluruh aplikasi.
//
// Cara pakai di module lain:
//    import client from "../mqtt/mqttClient.js";
//    client.publish("topic", "message");
//
// File ini memastikan koneksi hanya dibuat sekali (singleton).

import mqtt from "mqtt";

// URL dan kredensial broker disimpan di environment variables
const brokerUrl = process.env.MQTT_BROKER_URL;

const options = {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

// Membuat client MQTT dengan konfigurasi yang diberikan
const client = mqtt.connect(brokerUrl, options);

// Event ketika berhasil terkoneksi ke broker
client.on("connect", () => {
  console.log("✅ Connected to MQTT broker");
});

export default client;
